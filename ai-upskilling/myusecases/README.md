# URL Health Checker - Multithreading Demonstration

A comprehensive Java application that demonstrates all major multithreading concepts through a real-world URL health checking system.

## 🎯 Multithreading Features Covered

### Core Threading
- **Thread Pool Management**: `ThreadPoolExecutor` with custom rejection policies
- **Backpressure**: Bounded queues with `CallerRunsPolicy` for flow control
- **Rate Limiting**: `Semaphore` to control concurrent HTTP requests
- **Coordination**: `CountDownLatch` for task completion tracking

### Advanced Concurrency
- **Futures & Async**: `CompletableFuture` with timeouts and composition
- **Scheduled Tasks**: `ScheduledExecutorService` for retries and periodic reporting
- **Shared State**: `ConcurrentHashMap` with `ReentrantReadWriteLock`
- **Atomic Operations**: `AtomicLong`, `LongAdder` for thread-safe counters
- **Thread Context**: `ThreadLocal` for correlation IDs

### Error Handling & Resilience
- **Retry Logic**: Exponential backoff with jitter
- **Timeouts**: Per-request and overall timeouts
- **Graceful Shutdown**: Proper resource cleanup and task completion
- **Deadlock Prevention**: Ordered locking demonstration

## 🚀 Quick Start

### Prerequisites
- Java 11 or higher
- Internet connection (for HTTP requests)

### Running the Application

1. **Compile and run**:
   ```bash
   javac UrlHealthChecker.java
   java UrlHealthChecker
   ```

2. **The application will**:
   - Create a sample `urls.txt` file with test URLs
   - Process all URLs concurrently (20 at a time)
   - Retry failed requests up to 2 times
   - Generate a `results.csv` file with results
   - Demonstrate deadlock scenarios

### Sample Output
```
🚀 Starting URL Health Checker...
📊 Configuration: 20 concurrent, 8 threads, 500 queue capacity
📝 Created sample URLs file: urls.txt
📋 Loaded 20 URLs to check
🔄 Starting concurrent URL processing...
📊 Progress: 5 completed, 2 failed, 1 retries, 15 in-flight
📊 Progress: 12 completed, 3 failed, 2 retries, 8 in-flight
...
✅ All URLs processed successfully
📋 Generating final report...
💾 Results written to results.csv

📈 Final Summary:
  Total URLs: 20
  UP: 15 (75.0%)
  DOWN: 5 (25.0%)
  Total completed: 20
  Total failed: 5
  Total retries: 3
  Rejections: 0
```

## 📁 Generated Files

- **`urls.txt`**: Input file with URLs to check (auto-created if missing)
- **`results.csv`**: Output file with detailed results

## 🔧 Configuration

Modify these constants in the code to adjust behavior:

```java
private static final int MAX_CONCURRENT_CHECKS = 20;  // Max parallel HTTP requests
private static final int THREAD_POOL_SIZE = 8;        // Thread pool size
private static final int QUEUE_CAPACITY = 500;        // Task queue capacity
private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(3);
private static final int MAX_RETRIES = 2;             // Retry attempts
```

## 🧪 Learning Exercises

### 1. Modify Concurrency Settings
- Change `MAX_CONCURRENT_CHECKS` to see how it affects performance
- Adjust `THREAD_POOL_SIZE` and observe thread utilization
- Modify `QUEUE_CAPACITY` to test backpressure behavior

### 2. Add New Features
- Implement circuit breaker pattern
- Add metrics collection (Prometheus/Micrometer)
- Create a web dashboard for real-time monitoring
- Add support for different HTTP methods (POST, PUT)

### 3. Experiment with Threading Patterns
- Replace `CompletableFuture` with `ForkJoinPool` for CPU-intensive tasks
- Implement custom `ThreadFactory` with named threads
- Add `Phaser` for multi-stage coordination
- Use `StampedLock` for optimistic reads

### 4. Error Scenarios
- Test with invalid URLs to see error handling
- Simulate network failures by modifying timeout values
- Trigger backpressure by reducing queue capacity

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   URL Loader    │───▶│  Task Queue      │───▶│  Thread Pool    │
│                 │    │  (Backpressure)  │    │  (8 threads)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Results CSV   │◀───│  Result Index    │◀───│  HTTP Checker   │
│                 │    │  (Thread-Safe)   │    │  (Rate Limited) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ▲
                                │
                       ┌──────────────────┐
                       │  Retry Scheduler │
                       │  (Exponential    │
                       │   Backoff)       │
                       └──────────────────┘
```

## 🎓 Key Learning Points

1. **Thread Pool Design**: How to size thread pools and handle backpressure
2. **Rate Limiting**: Using semaphores to control external API calls
3. **Async Programming**: CompletableFuture composition and error handling
4. **Shared State Management**: Thread-safe data structures and locking strategies
5. **Graceful Shutdown**: Proper resource cleanup and task completion
6. **Deadlock Prevention**: Ordered locking and timeout-based acquisition

## 🔍 Monitoring & Debugging

The application includes built-in metrics:
- Completion counts (success/failure)
- Retry statistics
- Queue rejections
- In-flight task count
- Periodic progress reports

Use these to understand the system's behavior under different loads and configurations.

## 🚨 Common Issues

1. **Too many concurrent requests**: Reduce `MAX_CONCURRENT_CHECKS`
2. **Memory issues**: Decrease `QUEUE_CAPACITY` or increase heap size
3. **Timeout errors**: Increase `REQUEST_TIMEOUT` for slow URLs
4. **Deadlocks**: Check the deadlock demonstration section

## 📚 Further Reading

- [Java Concurrency in Practice](https://jcip.net/) - Comprehensive guide to Java concurrency
- [CompletableFuture Documentation](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html)
- [ThreadPoolExecutor Best Practices](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ThreadPoolExecutor.html)