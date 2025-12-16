import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.LongAdder;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.stream.Collectors;

/**
 * URL Health Checker - A comprehensive multithreading demonstration
 * 
 * Features covered:
 * - ThreadPoolExecutor with backpressure
 * - Semaphore for rate limiting
 * - CompletableFuture with timeouts and retries
 * - CountDownLatch for coordination
 * - ScheduledExecutorService for retries
 * - ConcurrentHashMap for shared state
 * - ReentrantReadWriteLock for safe reads
 * - AtomicLong/LongAdder for metrics
 * - ThreadLocal for correlation IDs
 * - Graceful shutdown handling
 * - Deadlock demonstration and prevention
 */
public class UrlHealthChecker {
    
    // Configuration
    private static final int MAX_CONCURRENT_CHECKS = 20;
    private static final int THREAD_POOL_SIZE = 8;
    private static final int QUEUE_CAPACITY = 500;
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(3);
    private static final Duration OVERALL_TIMEOUT = Duration.ofMinutes(2);
    private static final int MAX_RETRIES = 2;
    private static final String URLS_FILE = "urls.txt";
    private static final String RESULTS_FILE = "results.csv";
    
    // Threading components
    private final ThreadPoolExecutor executor;
    private final ScheduledExecutorService scheduler;
    private final Semaphore rateLimiter;
    private final HttpClient httpClient;
    private final ResultIndex resultIndex;
    private final Metrics metrics;
    private final BlockingQueue<UrlTask> taskQueue;
    
    // Coordination
    private volatile boolean shutdownRequested = false;
    private final CountDownLatch completionLatch;
    private final AtomicLong taskIdGenerator = new AtomicLong(0);
    
    // ThreadLocal for correlation IDs
    private static final ThreadLocal<String> CORRELATION_ID = new ThreadLocal<>();
    
    public UrlHealthChecker(int maxConcurrent, int poolSize, int queueCapacity) {
        // Thread pool with backpressure
        this.executor = new ThreadPoolExecutor(
            poolSize, poolSize, 30, TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(queueCapacity),
            new ThreadPoolExecutor.CallerRunsPolicy() // Backpressure to producer
        );
        
        // Scheduler for retries and periodic tasks
        this.scheduler = Executors.newScheduledThreadPool(2);
        
        // Rate limiter for HTTP calls
        this.rateLimiter = new Semaphore(maxConcurrent);
        
        // HTTP client with connection pooling
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();
        
        // Shared state management
        this.resultIndex = new ResultIndex();
        this.metrics = new Metrics();
        this.taskQueue = new ArrayBlockingQueue<>(queueCapacity);
        
        // Completion tracking
        this.completionLatch = new CountDownLatch(0); // Will be set when we know total count
    }
    
    /**
     * Main execution method
     */
    public void run() throws Exception {
        System.out.println("🚀 Starting URL Health Checker...");
        System.out.println("📊 Configuration: " + MAX_CONCURRENT_CHECKS + " concurrent, " + 
                          THREAD_POOL_SIZE + " threads, " + QUEUE_CAPACITY + " queue capacity");
        
        // Load URLs from file
        List<String> urls = loadUrls();
        if (urls.isEmpty()) {
            System.out.println("❌ No URLs found in " + URLS_FILE);
            return;
        }
        
        System.out.println("📋 Loaded " + urls.size() + " URLs to check");
        
        // Set up completion tracking
        CountDownLatch newLatch = new CountDownLatch(urls.size());
        // Replace the latch (this is a bit hacky but works for demo)
        FieldUtils.setFinalField(this, "completionLatch", newLatch);
        
        // Start periodic metrics reporting
        startMetricsReporter();
        
        // Start processing URLs
        processUrls(urls);
        
        // Wait for completion with timeout
        boolean completed = completionLatch.await(OVERALL_TIMEOUT.toMillis(), TimeUnit.MILLISECONDS);
        
        if (completed) {
            System.out.println("✅ All URLs processed successfully");
        } else {
            System.out.println("⏰ Processing timed out after " + OVERALL_TIMEOUT);
        }
        
        // Generate final report
        generateReport();
        
        // Graceful shutdown
        shutdown();
    }
    
    /**
     * Load URLs from file
     */
    private List<String> loadUrls() throws IOException {
        Path file = Path.of(URLS_FILE);
        if (!Files.exists(file)) {
            // Create sample URLs if file doesn't exist
            createSampleUrlsFile();
        }
        
        return Files.lines(file)
            .map(String::trim)
            .filter(line -> !line.isEmpty() && !line.startsWith("#"))
            .filter(this::isValidUrl)
            .distinct()
            .collect(Collectors.toList());
    }
    
    /**
     * Create sample URLs file for demonstration
     */
    private void createSampleUrlsFile() throws IOException {
        List<String> sampleUrls = Arrays.asList(
            "# Sample URLs for testing",
            "https://httpbin.org/status/200",
            "https://httpbin.org/status/404",
            "https://httpbin.org/status/500",
            "https://httpbin.org/delay/1",
            "https://httpbin.org/delay/5",
            "https://httpbin.org/timeout",
            "https://google.com",
            "https://github.com",
            "https://stackoverflow.com",
            "https://invalid-domain-that-does-not-exist.com",
            "https://httpbin.org/status/200",
            "https://httpbin.org/status/201",
            "https://httpbin.org/status/301",
            "https://httpbin.org/status/400",
            "https://httpbin.org/status/401",
            "https://httpbin.org/status/403",
            "https://httpbin.org/status/429",
            "https://httpbin.org/status/503",
            "https://httpbin.org/status/504"
        );
        
        Files.write(Path.of(URLS_FILE), sampleUrls);
        System.out.println("📝 Created sample URLs file: " + URLS_FILE);
    }
    
    /**
     * Validate URL format
     */
    private boolean isValidUrl(String url) {
        try {
            URI.create(url);
            return url.startsWith("http://") || url.startsWith("https://");
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Process all URLs concurrently
     */
    private void processUrls(List<String> urls) {
        System.out.println("🔄 Starting concurrent URL processing...");
        
        for (String url : urls) {
            if (shutdownRequested) break;
            
            UrlTask task = new UrlTask(taskIdGenerator.incrementAndGet(), url);
            
            try {
                // Submit task to executor
                CompletableFuture<UrlStatus> future = CompletableFuture.supplyAsync(() -> {
                    CORRELATION_ID.set("task-" + task.id);
                    return processUrl(task);
                }, executor);
                
                // Handle completion
                future.whenComplete((status, throwable) -> {
                    try {
                        if (throwable != null) {
                            UrlStatus errorStatus = UrlStatus.down(task.url, 
                                throwable.getClass().getSimpleName() + ": " + throwable.getMessage());
                            resultIndex.put(errorStatus);
                            metrics.recordFailure();
                        } else {
                            resultIndex.put(status);
                            if (status.isUp()) {
                                metrics.recordSuccess();
                            } else {
                                metrics.recordFailure();
                            }
                        }
                    } finally {
                        completionLatch.countDown();
                        CORRELATION_ID.remove();
                    }
                });
                
            } catch (RejectedExecutionException e) {
                System.err.println("⚠️ Task rejected (backpressure): " + task.url);
                metrics.recordRejection();
                completionLatch.countDown();
            }
        }
    }
    
    /**
     * Process a single URL with retries
     */
    private UrlStatus processUrl(UrlTask task) {
        return withRetry(() -> checkUrl(task.url), MAX_RETRIES)
            .orElse(UrlStatus.down(task.url, "Max retries exceeded"));
    }
    
    /**
     * Check a single URL with rate limiting and timeout
     */
    private CompletableFuture<UrlStatus> checkUrl(String url) {
        return CompletableFuture.supplyAsync(() -> {
            long startTime = System.nanoTime();
            
            try {
                // Acquire rate limiter permit
                if (!rateLimiter.tryAcquire(5, TimeUnit.SECONDS)) {
                    return UrlStatus.down(url, "Rate limit timeout");
                }
                
                try {
                    // Make HTTP request
                    HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .timeout(REQUEST_TIMEOUT)
                        .GET()
                        .build();
                    
                    HttpResponse<Void> response = httpClient.send(request, 
                        HttpResponse.BodyHandlers.discarding());
                    
                    Duration latency = Duration.ofNanos(System.nanoTime() - startTime);
                    
                    if (response.statusCode() >= 200 && response.statusCode() < 400) {
                        return UrlStatus.up(url, response.statusCode(), latency);
                    } else {
                        return UrlStatus.down(url, "HTTP " + response.statusCode(), latency);
                    }
                    
                } finally {
                    rateLimiter.release();
                }
                
            } catch (Exception e) {
                Duration latency = Duration.ofNanos(System.nanoTime() - startTime);
                return UrlStatus.down(url, e.getClass().getSimpleName(), latency);
            }
        }, executor)
        .orTimeout(REQUEST_TIMEOUT.plusSeconds(2), TimeUnit.SECONDS)
        .exceptionally(throwable -> {
            if (throwable instanceof TimeoutException) {
                return UrlStatus.down(url, "Timeout");
            }
            return UrlStatus.down(url, throwable.getClass().getSimpleName());
        });
    }
    
    /**
     * Retry mechanism with exponential backoff
     */
    private CompletableFuture<UrlStatus> withRetry(Supplier<CompletableFuture<UrlStatus>> operation, int maxAttempts) {
        CompletableFuture<UrlStatus> result = new CompletableFuture<>();
        retryWithBackoff(operation, maxAttempts, result);
        return result;
    }
    
    private void retryWithBackoff(Supplier<CompletableFuture<UrlStatus>> operation, int attemptsLeft, 
                                 CompletableFuture<UrlStatus> result) {
        operation.get().whenComplete((status, throwable) -> {
            if (status != null && status.isUp()) {
                result.complete(status);
            } else if (attemptsLeft <= 0) {
                result.complete(status != null ? status : UrlStatus.down("unknown", "Max retries exceeded"));
            } else {
                // Exponential backoff with jitter
                long delayMs = (long) (Math.pow(2, MAX_RETRIES - attemptsLeft) * 500 + 
                    ThreadLocalRandom.current().nextInt(100));
                
                scheduler.schedule(() -> {
                    if (!shutdownRequested) {
                        retryWithBackoff(operation, attemptsLeft - 1, result);
                    } else {
                        result.complete(UrlStatus.down("unknown", "Shutdown requested"));
                    }
                }, delayMs, TimeUnit.MILLISECONDS);
            }
        });
    }
    
    /**
     * Start periodic metrics reporting
     */
    private void startMetricsReporter() {
        scheduler.scheduleAtFixedRate(() -> {
            if (!shutdownRequested) {
                System.out.printf("📊 Progress: %d completed, %d failed, %d retries, %d in-flight%n",
                    metrics.getCompleted(), metrics.getFailed(), metrics.getRetries(), 
                    metrics.getInFlight());
            }
        }, 5, 5, TimeUnit.SECONDS);
    }
    
    /**
     * Generate final report
     */
    private void generateReport() {
        System.out.println("\n📋 Generating final report...");
        
        List<UrlStatus> results = resultIndex.snapshot();
        
        // Write to CSV
        try (PrintWriter writer = new PrintWriter(Files.newBufferedWriter(Path.of(RESULTS_FILE)))) {
            writer.println("URL,Status,StatusCode,LatencyMs,Error");
            
            for (UrlStatus status : results) {
                writer.printf("%s,%s,%d,%d,%s%n",
                    status.url(),
                    status.isUp() ? "UP" : "DOWN",
                    status.statusCode(),
                    status.latency().toMillis(),
                    status.error() != null ? status.error() : ""
                );
            }
            
            System.out.println("💾 Results written to " + RESULTS_FILE);
            
        } catch (IOException e) {
            System.err.println("❌ Failed to write results: " + e.getMessage());
        }
        
        // Print summary
        long upCount = results.stream().mapToLong(s -> s.isUp() ? 1 : 0).sum();
        long downCount = results.size() - upCount;
        
        System.out.printf("\n📈 Final Summary:%n");
        System.out.printf("  Total URLs: %d%n", results.size());
        System.out.printf("  UP: %d (%.1f%%)%n", upCount, 100.0 * upCount / results.size());
        System.out.printf("  DOWN: %d (%.1f%%)%n", downCount, 100.0 * downCount / results.size());
        System.out.printf("  Total completed: %d%n", metrics.getCompleted());
        System.out.printf("  Total failed: %d%n", metrics.getFailed());
        System.out.printf("  Total retries: %d%n", metrics.getRetries());
        System.out.printf("  Rejections: %d%n", metrics.getRejections());
    }
    
    /**
     * Graceful shutdown
     */
    public void shutdown() {
        System.out.println("\n🛑 Shutting down gracefully...");
        shutdownRequested = true;
        
        // Stop accepting new tasks
        executor.shutdown();
        scheduler.shutdown();
        
        try {
            // Wait for running tasks to complete
            if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
                System.out.println("⚠️ Forcing shutdown after timeout");
                executor.shutdownNow();
            }
            
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            executor.shutdownNow();
            scheduler.shutdownNow();
        }
        
        System.out.println("✅ Shutdown complete");
    }
    
    /**
     * Demonstrate deadlock scenario and prevention
     */
    public static void demonstrateDeadlock() {
        System.out.println("\n🔒 Deadlock Demonstration");
        
        // Deadlock scenario
        Object resource1 = new Object();
        Object resource2 = new Object();
        
        Thread thread1 = new Thread(() -> {
            synchronized (resource1) {
                System.out.println("Thread 1: Acquired resource1");
                try { Thread.sleep(100); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                synchronized (resource2) {
                    System.out.println("Thread 1: Acquired resource2");
                }
            }
        });
        
        Thread thread2 = new Thread(() -> {
            synchronized (resource2) {
                System.out.println("Thread 2: Acquired resource2");
                try { Thread.sleep(100); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                synchronized (resource1) {
                    System.out.println("Thread 2: Acquired resource1");
                }
            }
        });
        
        // Start both threads
        thread1.start();
        thread2.start();
        
        // Wait a bit to see if deadlock occurs
        try {
            Thread.sleep(1000);
            if (thread1.isAlive() || thread2.isAlive()) {
                System.out.println("⚠️ Potential deadlock detected - threads still running");
                thread1.interrupt();
                thread2.interrupt();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Demonstrate deadlock prevention with ordered locking
        System.out.println("\n🔓 Deadlock Prevention (Ordered Locking)");
        Object[] resources = {resource1, resource2}; // Always lock in same order
        
        Thread safeThread1 = new Thread(() -> {
            synchronized (resources[0]) {
                System.out.println("Safe Thread 1: Acquired resource1");
                synchronized (resources[1]) {
                    System.out.println("Safe Thread 1: Acquired resource2");
                }
            }
        });
        
        Thread safeThread2 = new Thread(() -> {
            synchronized (resources[0]) { // Same order as thread1
                System.out.println("Safe Thread 2: Acquired resource1");
                synchronized (resources[1]) {
                    System.out.println("Safe Thread 2: Acquired resource2");
                }
            }
        });
        
        safeThread1.start();
        safeThread2.start();
        
        try {
            safeThread1.join();
            safeThread2.join();
            System.out.println("✅ Safe execution completed without deadlock");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    // Inner classes for data structures
    
    /**
     * URL task representation
     */
    private static class UrlTask {
        final long id;
        final String url;
        
        UrlTask(long id, String url) {
            this.id = id;
            this.url = url;
        }
    }
    
    /**
     * URL status result
     */
    private record UrlStatus(String url, boolean up, int statusCode, Duration latency, String error) {
        static UrlStatus up(String url, int statusCode, Duration latency) {
            return new UrlStatus(url, true, statusCode, latency, null);
        }
        
        static UrlStatus down(String url, String error) {
            return new UrlStatus(url, false, 0, Duration.ZERO, error);
        }
        
        static UrlStatus down(String url, String error, Duration latency) {
            return new UrlStatus(url, false, 0, latency, error);
        }
        
        static UrlStatus down(String url, int statusCode, Duration latency) {
            return new UrlStatus(url, false, statusCode, latency, null);
        }
    }
    
    /**
     * Thread-safe result index with read/write lock
     */
    private static class ResultIndex {
        private final ConcurrentHashMap<String, UrlStatus> results = new ConcurrentHashMap<>();
        private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
        
        void put(UrlStatus status) {
            results.put(status.url(), status);
        }
        
        List<UrlStatus> snapshot() {
            lock.readLock().lock();
            try {
                return new ArrayList<>(results.values());
            } finally {
                lock.readLock().unlock();
            }
        }
    }
    
    /**
     * Thread-safe metrics collection
     */
    private static class Metrics {
        private final LongAdder completed = new LongAdder();
        private final LongAdder failed = new LongAdder();
        private final LongAdder retries = new LongAdder();
        private final LongAdder rejections = new LongAdder();
        private final AtomicLong inFlight = new AtomicLong(0);
        
        void recordSuccess() {
            completed.increment();
            inFlight.decrementAndGet();
        }
        
        void recordFailure() {
            failed.increment();
            inFlight.decrementAndGet();
        }
        
        void recordRetry() {
            retries.increment();
        }
        
        void recordRejection() {
            rejections.increment();
        }
        
        void incrementInFlight() {
            inFlight.incrementAndGet();
        }
        
        long getCompleted() { return completed.sum(); }
        long getFailed() { return failed.sum(); }
        long getRetries() { return retries.sum(); }
        long getRejections() { return rejections.sum(); }
        long getInFlight() { return inFlight.get(); }
    }
    
    /**
     * Utility for reflection-based field setting (hack for demo)
     */
    private static class FieldUtils {
        @SuppressWarnings("unchecked")
        static void setFinalField(Object target, String fieldName, Object value) {
            try {
                var field = target.getClass().getDeclaredField(fieldName);
                field.setAccessible(true);
                field.set(target, value);
            } catch (Exception e) {
                // Ignore for demo purposes
            }
        }
    }
    
    /**
     * Main entry point
     */
    public static void main(String[] args) {
        // Set up shutdown hook
        UrlHealthChecker checker = new UrlHealthChecker(MAX_CONCURRENT_CHECKS, THREAD_POOL_SIZE, QUEUE_CAPACITY);
        
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\n🛑 Shutdown hook triggered");
            checker.shutdown();
        }));
        
        try {
            // Run the health checker
            checker.run();
            
            // Demonstrate deadlock scenarios
            demonstrateDeadlock();
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
