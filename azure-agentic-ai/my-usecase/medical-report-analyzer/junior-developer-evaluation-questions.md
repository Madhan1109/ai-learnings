# Junior Developer Evaluation Questions

## Evaluation Scoring Template

Use the table below to capture answers and assign a score per question.

| S.No | Question | Answers | Score (0-3) |
|---|---|---|---|
| 1 |  |  |  |

Scoring: 0 = No answer, 1 = Basic, 2 = Good, 3 = Excellent.
## Medium to Hard Level Assessment

---

## 1. Core Java (15 Questions)

### OOP (3 Questions)
**Difficulty: Medium to Hard**

1. Explain the difference between abstract classes and interfaces in Java. When would you choose one over the other? Provide a practical example where an interface is more appropriate than an abstract class. - 2 (2)

**Answer:** Abstract classes can have both abstract and concrete methods, can have instance fields, and can have constructors. Interfaces (before Java 8) could only declare methods. Since Java 8, interfaces can have default and static methods. A class can extend only one abstract class but implement multiple interfaces.

Choose an abstract class when: you want to share code between related classes (template method pattern), need non-static/non-final fields, have common behavior to inherit.

Choose an interface when: you want to define a contract, need multiple implementations, want to achieve multiple inheritance benefits, API evolution is important.

Example: `List`, `Set`, `Collection` interfaces allow unrelated classes (ArrayList, LinkedList, HashSet) to share a common contract without forcing them into an inheritance hierarchy.

2. How does method overriding work in Java? What are the rules regarding visibility modifiers and return types? Can you override a static method? Why or why not? - 2 (3)

**Answer:** Method overriding allows a subclass to provide a specific implementation of a method defined in its superclass. Rules: 1) Overriding method must have same or wider visibility (cannot reduce), 2) Return type must be same or a subclass (covariant returns), 3) Method signature must match, 4) Cannot override static methods, 5) Cannot override final methods, 6) Cannot override private methods.

Static methods cannot be overridden because they are bound at compile time based on reference type, not runtime type. They can be "hidden" by declaring another static method with same signature in subclass, but this is method hiding, not overriding. Polymorphism doesn't apply.

3. Describe the Diamond Problem in multiple inheritance. How does Java handle this issue? Explain with code examples. - 0 (2)

**Answer:** The Diamond Problem occurs when a class inherits from two classes that both inherit from a common superclass, creating ambiguity about which method to call.

```java
interface A {
    default void method() { System.out.println("A"); }
}
interface B extends A {
    default void method() { System.out.println("B"); }
}
interface C extends A {
    default void method() { System.out.println("C"); }
}
class D implements B, C { } // ERROR: inherits unrelated defaults
```

Java handles this by: 1) Only supporting single inheritance for classes, 2) Requiring explicit resolution if default methods conflict (override in class), 3) Using the most specific interface rule for default methods, 4) Requiring explicit interface implementation when ambiguity exists.

### Collections (3 Questions)
**Difficulty: Medium to Hard**

4. Compare and contrast `ArrayList` and `LinkedList` in terms of performance characteristics (space complexity, time complexity for common operations). When would you choose `ArrayList` over `LinkedList` and vice versa? - 2 (2)

**Answer:** ArrayList uses a dynamic array; LinkedList uses doubly-linked nodes.

**Time Complexity:**
- **ArrayList**: get/set O(1), add to end O(1) amortized, add/remove at index O(n), contains O(n)
- **LinkedList**: get/set O(n), add to end O(1), add/remove at index O(n), contains O(n)

**Space**: ArrayList has better cache locality, LinkedList has extra memory for node pointers.

**Choose ArrayList when**: frequent random access, fewer insertions/deletions in middle, better for iterating, cache locality matters.

**Choose LinkedList when**: frequent insertions/deletions at specific positions, queue/deque operations, no random access needed.

5. What is the difference between `HashMap`, `Hashtable`, and `ConcurrentHashMap`? Explain thread-safety considerations and performance implications. - 2 (2)

**Answer:** 

**HashMap**: Non-thread-safe, allows null keys/values, faster, uses buckets with linked list/tree (JDK 8+), fail-fast iterators. Best for single-threaded use.

**Hashtable**: Thread-safe via synchronized methods (poor performance), doesn't allow nulls, slower due to locking entire table, legacy class - don't use.

**ConcurrentHashMap**: Thread-safe with better performance, uses lock striping (segmentation), read operations generally unsynchronized, writes use fine-grained locks, supports concurrent updates, introduced in Java 5.

Performance: HashMap > ConcurrentHashMap > Hashtable (for single-threaded, HashMap is best; for multi-threaded, ConcurrentHashMap is much better than Hashtable).

6. When should you use `TreeSet` vs `HashSet`? What are the time complexities for insert, delete, and lookup operations in both? Explain how `TreeSet` maintains order. - 3

**Answer:**

**HashSet**: O(1) average for insert, delete, lookup; O(n) worst case; no ordering guarantees; uses HashMap internally.

**TreeSet**: O(log n) for all operations; maintains sorted order; uses TreeMap (red-black tree) internally.

TreeSet maintains order via: 1) Comparator provided at construction, 2) Natural ordering if elements implement Comparable, 3) Red-black tree structure keeps elements sorted during insertion.

**Choose HashSet**: No ordering needed, better performance for simple existence checks, larger datasets where order doesn't matter.

**Choose TreeSet**: Need sorted order, range queries, elements that must stay sorted, can sacrifice O(1) for O(log n).

### Exception Handling (3 Questions)
**Difficulty: Medium to Hard**

7. What is the difference between checked and unchecked exceptions in Java? Explain the controversy around checked exceptions. What are `Error` and `Exception`, and when should you catch each? - 1 (1)

**Answer:**

**Checked exceptions**: Compiler enforces handling (try-catch or throws), represent recoverable conditions (IOException, SQLException). Must be declared in method signature or handled.

**Unchecked exceptions** (RuntimeException and its subclasses): Don't require handling, represent programming errors (NullPointerException, IllegalArgumentException). Runtime errors.

**Error** vs **Exception**: 
- Error: Serious problems (OutOfMemoryError, StackOverflowError), typically not catchable, indicate JVM issues.
- Exception: Catchable, represents conditions that can be handled.

**When to catch**: Catch exceptions to handle recoverable errors; rarely catch Errors (they indicate system failures).

**Controversy**: Critics argue checked exceptions force try-catch everywhere, break encapsulation, and lead to empty catch blocks. Supporters say they enforce error handling. Modern trend is toward unchecked exceptions.

8. Explain the concept of exception chaining in Java. How does it differ from exception wrapping? Provide an example where exception chaining is important. - 0 (0)

**Answer:** Exception chaining preserves the original exception when throwing a new one, allowing full context of the failure chain. This is done via the `cause` parameter in constructors.

```java
try {
    parseFile(file);
} catch (FileParseException e) {
    throw new DataProcessingException("Failed to process file", e);
}
```

**Difference from wrapping**: Chaining explicitly sets the cause using a standard mechanism; wrapping is implicit and may lose context.

**Importance**: Critical for debugging - maintains the full stack trace, shows where the real problem occurred, helps in production troubleshooting.

9. What happens if both a catch block and finally block throw exceptions in Java? How does this impact the program execution? Explain with code. - 1 (2)

**Answer:** Only the exception from the finally block propagates; the catch block's exception is suppressed (available via `suppressed` list in Java 7+).

```java
try {
    throw new Exception("Original");
} catch (Exception e) {
    throw new RuntimeException("From catch", e);
} finally {
    throw new RuntimeException("From finally");
}
// Result: Only "From finally" is thrown, "From catch" is suppressed
```

**Impact**: The original exception context can be lost unless using try-with-resources which handles suppression automatically. This is a common source of bugs - always check for suppressed exceptions when debugging.

### Generics (3 Questions)
**Difficulty: Medium to Hard**

10. What are type erasure and reification in Java Generics? Explain why Java uses type erasure and what limitations this imposes. - 1 (0)

**Answer:**

**Type erasure**: Process by which generic type information is removed at compile time, leaving behind only raw types and casts. At runtime, `List<String>` becomes just `List`.

**Reification**: Having type information available at runtime. Java generics are NOT reified (unlike C# generics).

**Why erasure**: Backward compatibility with pre-generics Java (introduced in Java 5), easier migration path, simpler runtime.

**Limitations**: 
- Cannot use `instanceof` with generic types: `obj instanceof List<String>` is illegal
- Cannot create arrays: `new List<String>[10]` is illegal
- Cannot overload methods with same erasure
- Cannot catch generic exceptions
- Reflection loses generic type info (Type Erasure)

11. Explain wildcards in Java Generics (`?`, `? extends T`, `? super T`). When would you use each? Provide practical examples. - 0 (0)

**Answer:**

**`?` (Unbounded wildcard)**: Any type; read-only; neither read nor write type-safe operations. Use for read-only access.

```java
void printList(List<?> list) { } // Accept any List
```

**`? extends T` (Upper bounded)**: T or its subtypes; producer, read-only. Can read as T, cannot add elements.

```java
void processNumbers(List<? extends Number> list) { 
    Number n = list.get(0); // OK - reading
    list.add(10); // ERROR - writing
}
```

**`? super T` (Lower bounded)**: T or its supertypes; consumer, write-only. Can add elements of type T or subtypes.

```java
void addNumbers(List<? super Integer> list) {
    list.add(10); // OK - writing
    Integer i = list.get(0); // ERROR - unsafe read
}
```

**PECS**: Producer extends, Consumer super.

12. What is the difference between `List<? extends Number>` and `List<Number>`? Can you add elements to both? Explain why or why not with code examples. - 0 (0)

**Answer:**

**`List<Number>`**: Specific type, can add Number or subtypes, can read as Number, invariant type.

**`List<? extends Number>`**: Bounded wildcard (Number or subtypes), read-only from the list, cannot add anything (except null), use for reading/producing.

```java
List<Integer> ints = Arrays.asList(1,2,3);
List<? extends Number> nums = ints; // OK
// nums.add(10); // ERROR - compile error!
Number n = nums.get(0); // OK - can read

List<Number> nums2 = new ArrayList<>();
nums2.add(10); // OK - can add
Number n2 = nums2.get(0); // OK - can read
```

Cannot add to `List<? extends Number>` because the actual type might be `List<Integer>`, `List<Double>`, etc., and cannot guarantee the added element matches the actual type.

### Streams & Lambdas (3 Questions)
**Difficulty: Medium to Hard**

13. Explain the difference between `map()`, `flatMap()`, and `filter()` operations in Java Streams. When would you use `flatMap()` over `map()`? Provide examples. - 1 (1)

**Answer:**

**`map(Function)`**: Transforms each element 1-to-1. Input: Stream<T>, Output: Stream<R>. Example: `names.map(String::toUpperCase)`.

**`flatMap(Function>`**: Maps AND flattens nested structures. Input: Stream<T>, Output: Stream<R>. Transforms one element to multiple (or zero) elements and flattens.

```java
List<List<String>> nested = Arrays.asList(
    Arrays.asList("a", "b"), Arrays.asList("c", "d"));
List<String> flat = nested.stream()
    .flatMap(List::stream) // flattens
    .collect(Collectors.toList());
```

**`filter(Predicate)`**: Filters elements based on condition. Output stream has fewer or same elements.

**Use flatMap when**: Returning a Stream inside map operation, flattening nested collections, mapping to multiple elements, handling Optional results.

14. What are the differences between parallel streams and sequential streams in Java? When should you use parallel streams? What considerations should you keep in mind? - 1

**Answer:**

**Sequential streams**: Execute on single thread, maintain order, predictable behavior, better for small datasets.

**Parallel streams**: Execute on multiple threads (ForkJoinPool), may not maintain order (unless explicitly ordered), may have overhead, better for large datasets.

**When to use parallel**:
- Large datasets (> 1M elements)
- CPU-intensive operations
- Data is stateless
- Splittable data structures

**Considerations**:
- Shared mutable state breaks parallelism
- Overhead can make it slower for small datasets
- Thread pool exhaustion if too many parallel streams
- Non-associative operations cause incorrect results
- Order-sensitive operations may behave differently
- Use `.parallel()` or `.sequential()` to control

15. Explain method references in Java. When would you use method references instead of lambda expressions? Provide examples of all four types of method references. - 0

**Answer:** Method references are shorthand for lambdas that call existing methods.

**Four types**:
1. **Static**: `Integer::parseInt` → `s -> Integer.parseInt(s)`
2. **Instance on specific object**: `str::toUpperCase` → `() -> str.toUpperCase()`
3. **Instance on arbitrary object**: `String::length` → `s -> s.length()`
4. **Constructor**: `ArrayList::new` → `() -> new ArrayList()`

```java
// Examples:
Function<String, Integer> f1 = Integer::parseInt;
Runnable r = this::run;
Function<String, Integer> f2 = String::length;
Supplier<List<String>> supplier = ArrayList::new;
```

**When to use**: Improves readability when lambda just calls an existing method, more concise, better tooling support. Prefer when it makes code clearer than lambda expression.

---

## 2. JVM & Performance (12 Questions)

### JVM Internals (3 Questions)
**Difficulty: Medium to Hard**

16. Explain the JVM memory model. What are the different runtime data areas (heap, stack, method area, etc.) and their purposes? - 2 he is answering out of the topic or what he knows or what he learned

**Answer:** The JVM runtime memory is divided into: **Heap** (shared, stores objects, divided into Young/Old generations), **Method Area/Metaspace** (class metadata, statics), **JVM Stack** (per-thread method frames), **PC Registers** (program counters), **Native Method Stack** (for native code).


17. What is the difference between the JVM stack and heap? Explain how objects are stored and passed in Java (by value vs by reference). - 0 (0)

**Answer:** **Stack**: Per-thread, fast, stores method frames & local variables, LIFO, automatic cleanup. **Heap**: Shared, stores objects, GC-managed, larger. Java passes **by value always** - primitives copied, object references copied (both point to same object), so changes to object fields affect original.


18. Explain how the JVM loads classes. What are the class loading phases and what happens in each phase? - 0

**Answer:** Class loading phases: 1) **Loading** - read .class file, create Class object; 2) **Linking** - Verification (bytecode validity), Preparation (allocate static vars), Resolution (symbolic references); 3) **Initialization** - run static blocks. Uses ClassLoaders: Bootstrap, Extension, Application.


### GC & Tuning (3 Questions)
**Difficulty: Medium to Hard**

19. Explain the different garbage collection algorithms in the JVM (e.g., Serial, Parallel, G1, ZGC). When would you choose one over another? - 1 (0)

**Answer:** **Serial GC**: Single-threaded, small apps. **Parallel GC**: Default JDK 8, good throughput. **G1 GC**: Region-based, predictable pauses, best for >4GB heaps. **ZGC**: <10ms pauses, massive heaps. Choose based on latency needs, heap size.


20. What is a stop-the-world pause? How do modern GC algorithms like G1 and ZGC minimize these pauses? Explain the concept of incremental compaction. - 1

**Answer:** **STW pause**: All threads freeze during GC. Modern GCs minimize via: concurrent marking, incremental compaction (move objects in batches), generational hypothesis, parallel collection.


21. How would you identify and troubleshoot a memory leak in a Java application? What tools and techniques would you use? - 0 (1)

**Answer:** **Symptoms**: Growing heap, frequent GC, OOM error. **Tools**: jmap heap dumps, MAT analyzer, GC logs, VisualVM, JProfiler. **Check**: Unclosed streams/resources, caches without limits, unremoved listeners, ThreadLocal leaks, static collections.


### Heap & Metaspace (3 Questions)
**Difficulty: Medium to Hard**

22. Explain the structure of the heap in JVM (young generation, old generation). What are survivor spaces and eden space? - 1

**Answer:** **Heap structure**: **Young Gen**: Eden (new allocations) → Survivor 0/1 (survived one GC) → Old Gen (survived multiple GCs). Objects start in Eden, survive to Survivor spaces, promoted to Old Gen after threshold.


23. What is the difference between the PermGen and Metaspace? Why did Java replace PermGen with Metaspace? How would you tune Metaspace size? - 0

**Answer:** **PermGen**: Fixed size, may cause OOM, part of heap in Java 7-. **Metaspace**: Native memory in Java 8+, dynamic size, no PermGen OOM. Tune: `-XX:MetaspaceSize` and `-XX:MaxMetaspaceSize`.


24. How does object allocation work in the heap? What is the difference between minor GC and major GC? When does promotion occur? - 0

**Answer:** Objects allocated in Eden space. **Minor GC**: Collects Young Gen only, fast, frequent. **Major GC/Full GC**: Collects entire heap, slower. **Promotion**: Objects moved to Old Gen after surviving multiple minor GCs (age counter reaches threshold, usually 15).


### JMX Monitoring (3 Questions)
**Difficulty: Medium to Hard**

25. Explain what JMX is and its architecture (MBeans, MBean Server, Connectors). How would you expose custom metrics via JMX? - 1

**Answer:** **JMX**: Java Management Extensions for monitoring/management. Architecture: **MBeans** (managed beans, expose attributes/operations), **MBean Server** (registry), **Connectors** (client access). Expose metrics: Implement MXBean interface or use @ManagedAttribute/@ManagedOperation annotations.


26. What are the different types of MBeans (standard, dynamic, model, MX)? When would you use each type?

**Answer:** **Standard MBeans**: Simple interface. **Dynamic**: Runtime structure. **Model**: Notifications support. **MX MBeans**: Platform MBeans (Memory, Thread, etc.) - cannot change. Use MX for platform metrics, Standard for custom business metrics.


27. How would you monitor JVM performance using JMX in a production environment? What key metrics would you track and why?

**Answer:** Monitor via JConsole, JVisualVM, or JMX clients. **Key metrics**: Heap usage %, GC time/frequency, thread count, CPU usage, memory pools, class loading count, JIT compilation time. Track for: memory leaks, GC efficiency, performance bottlenecks, resource exhaustion.

## Concurrency & Async Answers (Questions 28-43)


---

## 3. Concurrency & Async (16 Questions)

### Threads & Executors (4 Questions)
**Difficulty: Medium to Hard**

28. Explain the different ways to create threads in Java. What are the advantages and disadvantages of each approach? - 2 (2)

**Answer:** Create threads: 1) Extend Thread class, 2) Implement Runnable, 3) Implement Callable (return value), 4) Use ExecutorService (preferred). ExecutorService advantages: pool management, better resource control, task submission decoupled from execution.


29. What is the Executor framework? Explain the different executor implementations (FixedThreadPool, CachedThreadPool, ScheduledThreadPool) and their use cases. - 1 (1)

**Answer:** **Executor framework**: Handles thread lifecycle management. **FixedThreadPool**: Fixed size, queue unlimited. **CachedThreadPool**: Creates threads on demand, reuses idle threads. **ScheduledThreadPool**: Delayed/periodic execution. **SingleThreadExecutor**: Single worker. Use based on task type and requirements.


30. What is the difference between `execute()` and `submit()` methods in the ExecutorService? When should you use each? - 1 (1)

**Answer:** **execute()**: No return value, fires-and-forgets, cannot check completion. **submit()**: Returns Future, can check completion/cancel/retrieve result, can catch exceptions. Use execute for simple tasks, submit when you need return value or control.


31. Explain how `ForkJoinPool` works and its relationship with the Fork-Join framework. When is it more efficient than regular thread pools? - 2 (0)

**Answer:** **ForkJoinPool**: Work-stealing algorithm, splits tasks recursively, good for divide-conquer problems. Efficient for: parallel processing, recursive algorithms, work-stealing benefits. More efficient than regular pools when tasks can be split into smaller chunks.


### Synchronization (4 Questions)
**Difficulty: Medium to Hard**

32. Explain the difference between `synchronized`, `volatile`, and `ReentrantLock`. When would you use each? What are their performance characteristics? - 2 (1)

**Answer:** **synchronized**: Intrinsic lock, reentrant, automatic release. **volatile**: Ensures visibility, no atomicity. **ReentrantLock**: Explicit lock, interruptible, fair lock option, better performance. Use synchronized for simplicity, ReentrantLock for advanced features (timed lock, interrupt).


33. What is the difference between `sleep()`, `yield()`, and `wait()` in Java? Explain when threads yield control and the state transitions. - 0.5

**Answer:** **sleep()**: Sleeps current thread, doesn't release lock, static method, interrupted by InterruptedException. **yield()**: Suggests giving up CPU to other threads, hint only. **wait()**: Releases lock, must be in synchronized block, object method, wait for notification. Only wait() releases monitor lock.


34. Explain the concepts of deadlock, livelock, and starvation in concurrent programming. How would you detect and prevent each? - 1 

**Answer:** **Deadlock**: Circular waiting for locks (A waits for B, B waits for A). **Livelock**: Threads keep changing state but make no progress. **Starvation**: Thread perpetually denied resources. **Prevent**: Ordered locks, timeout on locks, avoid nested locks, detect via thread dumps.


35. What are `ThreadLocal` variables? How do they work internally? What are their use cases and pitfalls? - 0

**Answer:** **ThreadLocal**: Per-thread storage, eliminates need for synchronization. Useful for: per-thread context (user sessions), avoiding parameter passing. **Pitfalls**: Memory leaks if not cleared (in thread pools), thread pool reuse keeps values. Always use try-finally cleanup.


### CompletableFuture (4 Questions)
**Difficulty: Medium to Hard**

36. Explain the difference between `Future` and `CompletableFuture`. What advantages does `CompletableFuture` provide? - 1  (2)

**Answer:** **Future**: Basic async result, requires ExecutorService, blocking get(), no composition. **CompletableFuture**: Completable (can complete manually), compose (thenApply, thenCompose), combine (allOf, anyOf), async variants, better for complex async flows.


37. How does `CompletableFuture` handle exception propagation in chain methods (`thenApply`, `thenCompose`, `thenCombine`)? Provide examples. - 0 

**Answer:** Exceptions in chain methods (thenApply, thenCompose) are wrapped in CompletionException. Use handle() or exceptionally() to catch. Example: `cf.thenApply(x -> x/0).exceptionally(e -> handle(e))`.


38. When would you use `CompletableFuture.allOf()` vs `CompletableFuture.anyOf()`? How would you handle partial failures in `allOf()`? - 0

**Answer:** **allOf()**: Wait for all to complete (successful or failed). **anyOf()**: First to complete. Handle partial failures in allOf: Check each future individually, collect results with exception handling per future.


39. Explain the difference between `thenCompose()` and `thenApply()`. When would you use async methods (`thenApplyAsync` vs `thenApply`)? - 0

**Answer:** **thenApply**: Transform result of current future. **thenCompose**: Chain futures (current future's result is another future). Use thenCompose to avoid CompletableFuture<CompletableFuture<T>>. Async variants (thenApplyAsync) execute on different thread; use for CPU-intensive tasks.


### Concurrency Utilities (4 Questions)
**Difficulty: Medium to Hard**

40. Explain the purpose and use cases of `CountDownLatch`, `CyclicBarrier`, and `Semaphore`. What are the differences between them? - 0 

**Answer:** **CountDownLatch**: One-time coordination, threads wait until count reaches zero. **CyclicBarrier**: Reusable, threads wait at barrier until all arrive. **Semaphore**: Control access to resource, permits available. CountDownLatch: waiting at single point. CyclicBarrier: synchronized start. Semaphore: resource access control.


41. What is the `ConcurrentHashMap` and how does it provide thread-safety? Explain the segment locking mechanism and recent changes in Java 8+. - 0

**Answer:** **ConcurrentHashMap**: Thread-safe map using lock striping (segmented locks). In Java 8+: TreeNodes for bins, lower contention via CAS operations, striped locks on buckets. Better than Hashtable (doesn't lock entire table).


42. Explain the difference between `BlockingQueue` implementations (`ArrayBlockingQueue`, `LinkedBlockingQueue`, `SynchronousQueue`, etc.). When would you use each? - 1

**Answer:** **ArrayBlockingQueue**: Fixed size, array-backed, fair/non-fair. **LinkedBlockingQueue**: Optional bounded, linked nodes, better throughput. **SynchronousQueue**: Zero capacity, direct handoff. **PriorityBlockingQueue**: Priority ordering, unbounded. Use based on capacity needs and throughput requirements.


43. What are `Phaser` and `Exchanger` in the concurrency utilities? Provide practical use cases for each. - 0 (0)

**Answer:** **Phaser**: Advanced CyclicBarrier, variable party count, multiple phases. Use: Multi-phase algorithms. **Exchanger**: Two threads exchange data at synchronization point. Use: Producer-consumer pairs, bidirectional data exchange.

## Spring Framework Answers (Questions 44-59)


---

## 4. Spring Framework (16 Questions)

### Spring Core (4 Questions)
**Difficulty: Medium to Hard**

44. Explain the Spring IoC container and dependency injection. What are the different types of DI (constructor, setter, field injection)? What are the pros and cons of each? - 1 (2)

**Answer:** **IoC Container**: Inversion of Control - framework creates/manages beans, injects dependencies. **DI Types**: Constructor (immutable, mandatory, preferred), Setter (optional, flexible), Field injection (@Autowired on fields, discouraged). Constructor: testable, enforced initialization. Setter: optional deps, mutable.


45. What is the difference between `@Autowired`, `@Qualifier`, and `@Primary` annotations? How does Spring resolve bean dependencies? - 1 (1)

**Answer:** **@Autowired**: Marks dependency for injection. **@Qualifier**: Specifies which bean to inject when multiple of same type. **@Primary**: Default choice when multiple candidates exist. Resolution: By type → by qualifier → by name → primary marker.


46. Explain Spring bean scopes. What are `singleton`, `prototype`, `request`, `session`? How does the `proxy` mode affect singleton beans?  - 1 (1)

**Answer:** Bean scopes: **singleton** (one per container, default), **prototype** (new each time), **request** (web, per HTTP request), **session** (web, per HTTP session). **Proxy mode**: Required for injecting shorter-lived scoped beans into singleton - proxy intercepts calls to delegate to actual scoped bean.


47. Explain the Spring bean lifecycle. What are the different lifecycle callbacks and when should you use them? - 1

**Answer:** **Bean lifecycle**: 1) Instantiate, 2) Populate properties, 3) BeanNameAware, 4) BeanFactoryAware, 5) postProcessBeforeInitialization, 6) @PostConstruct / InitializingBean, 7) postProcessAfterInitialization, 8) Bean ready, 9) @PreDestroy / DisposableBean.destroy(). Use for: initialization logic, cleanup.


### Spring Boot (4 Questions)
**Difficulty: Medium to Hard**

48. How does Spring Boot auto-configuration work? Explain the `@Conditional` annotations and how Spring Boot decides which auto-configurations to apply. - 0 (1)

**Answer:** **Auto-configuration**: Classes auto-configured via @Conditional annotations (@ConditionalOnClass, @ConditionalOnProperty, @ConditionalOnMissingBean, etc.). Spring Boot scans classpath, applies configs that match conditions. Enables "convention over configuration".


49. What is the Spring Boot Actuator? Explain how to expose custom health checks and metrics endpoints. - 0 (1)

**Answer:** **Actuator**: Production-ready features (health checks, metrics, endpoints). Custom health check: Implement HealthIndicator interface. Custom metrics: Use MeterRegistry. Expose via /actuator endpoints.


50. Explain Spring Boot profiles and how they differ from Spring profiles. How would you manage different configurations for dev, staging, and production environments? - 2 (2)

**Answer:** **Profiles**: Isolate application configs (dev, prod, test). Use @Profile annotation or application-{profile}.properties. Manage via spring.profiles.active property. Allows different data sources, configurations per environment.


51. What is Spring Boot DevTools? How does it enable hot-reloading? Explain the classloader configuration. - 0

**Answer:** **DevTools**: Provides development-time features including automatic restart. Uses two classloaders: base (unchanged libraries) and restart (application classes). Only restarts application classloader when changes detected, enabling hot reloading without full restart.


### Spring Data (4 Questions)
**Difficulty: Medium to Hard**

52. Explain Spring Data JPA and how it simplifies data access. What are the different types of queries (`@Query`, `Derived Query Methods`, `Specification`)? - 1

**Answer:** **Spring Data JPA**: Reduces boilerplate via repository abstraction. **Query types**: 1) Derived query methods (findByXxx), 2) @Query (JPQL/SQL), 3) Specification (Dynamic query building). Simplifies CRUD operations.


53. How does Spring Data repositories work? Explain the repository hierarchy (`Repository`, `CrudRepository`, `JpaRepository`) and their capabilities. - 1

**Answer:** **Repository hierarchy**: Repository (base, marker) → CrudRepository (CRUD ops) → PagingAndSortingRepository (paging/sorting) → JpaRepository (JPA specific, flush/deleteInBatch). Each adds more functionality.


54. What is the N+1 problem in JPA/Spring Data? How would you identify and solve it using Spring Data features? - 0 (0)

**Answer:** **N+1 problem**: Executing 1 query for parent + N queries for children when accessing relationships. **Identify**: Enable SQL logging, check query count. **Solve**: Use JOIN FETCH, @EntityGraph, BatchSize, or DTO projections.


55. Explain Spring Data projections and when you would use them. What is the difference between `interface-based` and `class-based` projections? - 0

**Answer:** **Projections**: Limit data fetched. **Interface-based**: Define interface with getters, Spring generates proxy. **Class-based**: Use DTO with constructor. Use for: reducing data transfer, optimizing queries, avoiding lazy loading issues.


### Spring MVC (4 Questions)
**Difficulty: Medium to Hard**

56. Explain the Spring MVC request lifecycle (DispatcherServlet, HandlerMapping, Controller, ViewResolver). What happens when a request comes in? - 2 (2)

**Answer:** **Request lifecycle**: Request → DispatcherServlet → HandlerMapping (find controller) → Controller (process) → ModelAndView → ViewResolver → View. Steps: Receive request, determine handler, execute controller, resolve view, render response.


57. What is the difference between `@Controller` and `@RestController`? When would you use `@ResponseBody` annotation? - 3 (2)

**Answer:** **@Controller**: Returns view name, used with ViewResolver. **@RestController**: Adds @ResponseBody to all methods, returns JSON. **@ResponseBody**: Marks method return as HTTP response body (not view). @RestController = @Controller + @ResponseBody.


58. Explain Spring MVC exception handling. What is `@ControllerAdvice` and `@ExceptionHandler`? How would you create a global exception handler? - 2 (2)

**Answer:** **@ControllerAdvice**: Globally shared exception handlers. **@ExceptionHandler**: Method handles specific exceptions. Global handler: Create @ControllerAdvice class with @ExceptionHandler methods. Centralized error handling, customizable responses.


59. What are interceptors and filters in Spring MVC? Explain the difference and when you would use each. - 1 (1)

**Answer:** **Filters**: Servlet-level, wrap request/response, pre/post processing, chain execution. **Interceptors**: Spring MVC level, AOP-like, access to HandlerMapping info. Use Filters for cross-cutting concerns (logging, CORS). Use Interceptors for Spring-specific logic (authentication, pre/post controller).

## Relational Databases Answers (Questions 60-71)


---

## 5. Relational Databases (12 Questions)

### SQL Basics (3 Questions)
**Difficulty: Medium to Hard**

60. Explain the difference between `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, and `FULL OUTER JOIN`. When would you use each? Provide SQL examples. - 2

stored procedures question? - 1

**Answer:** **INNER JOIN**: Returns matching rows only. **LEFT JOIN**: All left rows + matching right (null if no match). **RIGHT JOIN**: All right rows + matching left. **FULL OUTER JOIN**: All rows from both. Use LEFT when you need all from left, INNER when you need only matches.


61. What are window functions in SQL? Explain `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, and `PARTITION BY`. Provide examples. - 0

**Answer:** **Window functions**: Compute values over set of rows without grouping. **ROW_NUMBER()**: Sequential numbering. **RANK()**: Ranking with gaps (1,1,3). **DENSE_RANK()**: Ranking without gaps (1,1,2). **PARTITION BY**: Groups window calculations (like GROUP BY for windows).


62. Explain the difference between `UNION` and `UNION ALL`. When would you use a `CTE` (Common Table Expression) vs a subquery? What are their performance implications? - 0

**Answer:** **UNION**: Distinct results (removes duplicates). **UNION ALL**: All results including duplicates (faster). **CTE** (WITH clause): Named temporary result set, better readability, can be recursive. Use CTE for complex queries, UNION for combining queries. CTE may be materialized (performance depends).


### Transactions (3 Questions)
**Difficulty: Medium to Hard**

63. What are ACID properties in database transactions? Explain each property with examples. What happens if ACID properties are violated? (1) - 1

**Answer:** **ACID**: Atomicity (all or nothing), Consistency (valid transitions), Isolation (concurrent transactions don't interfere), Durability (committed data persists). **Violations**: Rollback on failure, constraint violations, lost updates, data loss. Transaction logs and checkpoints maintain integrity.


64. Explain the different transaction isolation levels (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE). What are the concurrency issues each level solves? - 0

**Answer:** **READ UNCOMMITTED**: Dirty reads possible. **READ COMMITTED**: No dirty reads, non-repeatable reads possible. **REPEATABLE READ**: Locks prevent non-repeatable reads. **SERIALIZABLE**: Highest isolation, phantom reads prevented. Trade-off: Higher isolation = lower concurrency.


65. What is a deadlock in database transactions? How do databases detect and resolve deadlocks? What strategies can you use to minimize deadlocks? (0) - 0

**Answer:** **Deadlock**: Circular wait for locks. **Detect**: Transaction manager times out, rolls back one transaction. **Prevent**: Consistent lock ordering, short transactions, indexing (fast lookups), avoid long-running transactions. Application-level retry logic.


### JDBC (3 Questions)
**Difficulty: Medium to Hard**

66. Explain the JDBC architecture and how it enables database connectivity. What are the key interfaces in the JDBC API?

**Answer:** **JDBC architecture**: Java API for database connectivity via drivers. **Key interfaces**: Driver (loads driver), Connection (session), Statement/PreparedStatement (SQL execution), ResultSet (query results), CallableStatement (stored procedures). Standards-based database access.


67. What is a connection pool and why is it important? Explain how to configure and tune a connection pool (minimum, maximum, timeout settings). - 0

**Answer:** **Connection pool**: Cache of database connections for reuse. **Why**: Creating connections is expensive. **Configure**: Minimum/maximum pool size, timeout, idle timeout, leak detection. Tune based on application load and database capacity.


68. Explain `PreparedStatement` vs `Statement`. What are the benefits of using prepared statements? How do you handle batch operations with JDBC? - 1

**Answer:** **PreparedStatement**: Precompiled SQL with parameters (?), prevents SQL injection, better performance for repeated queries. **Statement**: Dynamic SQL construction, risks SQL injection. **Batch**: groupExecute() for multiple statements, improves performance. Always use PreparedStatement for user input.


### JPA/Hibernate (3 Questions)
**Difficulty: Medium to Hard**

69. Explain the difference between `EntityManager.persist()`, `EntityManager.merge()`, and `EntityManager.flush()`. When should you use each? - 0

**Answer:** **persist()**: Makes entity managed, attaches to persistence context, must not exist in DB. **merge()**: Detaches then reattaches, updates existing or inserts new, returns managed entity. **flush()**: Synchronizes persistence context with database (not commits). Use persist for new entities, merge for detached entities.


70. What are the different JPA/Hibernate fetch types (`EAGER` vs `LAZY`)? Explain the pitfalls of each and best practices. - 1

**Answer:** **EAGER**: Loaded with parent, causes N+1 if done repeatedly. **LAZY**: Loaded on access (via proxy), efficient but LazyInitializationException if accessed outside session. **Best practice**: Default LAZY, use JOIN FETCH or @EntityGraph when needed. Consider pagination for lazy loaded collections.


71. Explain the difference between `@OneToOne`, `@OneToMany`, `@ManyToOne`, and `@ManyToMany` relationships in JPA. How does cascading work?

**Answer:** **@OneToOne**: One entity relates to one. **@OneToMany**: One parent has many children. **@ManyToOne**: Many children to one parent. **@ManyToMany**: Many-to-many via join table. **Cascading**: AUTO, PERSIST, MERGE, REMOVE, REFRESH, DETACH. Specify cascade behavior (e.g., cascade = REMOVE for automatic child deletion).

## NoSQL Databases Answers (Questions 72-80)


---

## 6. NoSQL Databases (9 Questions)

### Document DBs (3 Questions)
**Difficulty: Medium to Hard**

72. Explain document database architecture (MongoDB, CouchDB). What are the advantages and disadvantages compared to relational databases? (0) - 2

**Answer:** **Document DB**: Store semi-structured JSON/BSON, schema flexible, embedded documents for related data. **Advantages**: Flexibility, horizontal scaling, denormalized data. **Disadvantages**: No joins, eventual consistency challenges, need application-side validation.


73. How would you model relationships in a document database? Compare embedding vs referencing documents. When should you use each approach? - 0

**Answer:** **Embedding**: Store related data in same document. **Referencing**: Store IDs to other documents. Use **embedding** when: Data accessed together, small documents, atomic updates needed. Use **referencing** when: Many-to-many relationships, large documents, need independent updates.


74. What are indexes in document databases? Explain different index types and how they affect query performance. How would you design indexes for a given query pattern? - 0.5

**Answer:** **Indexes**: Speed up queries, similar to RDBMS. **Types**: Single field, compound, multikey, text, geospatial. **Design**: Create indexes based on query patterns (not all fields). Balance query speed vs write performance. Use explain() to analyze query plans.


### Key-Value Stores (3 Questions)
**Difficulty: Medium to Hard**

75. When would you choose a key-value store (Redis, DynamoDB) over a relational database? What are the typical use cases? - 2

**Answer:** Choose **key-value stores** for: High-performance caching, session storage, simple data models, high-throughput needs. **Redis**: In-memory, fast, rich data structures. **DynamoDB**: Managed, scalable, eventual consistency. **Use cases**: Caching, leaderboards, rate limiting, pub-sub.


76. Explain Redis data structures (strings, hashes, lists, sets, sorted sets). When would you use each? What are their performance characteristics? - 0

**Answer:** **Strings**: Basic operations, SET/GET. **Hashes**: O(1) field access, good for objects. **Lists**: Ordered, LPUSH/RPOP. **Sets**: Unique unordered elements, membership O(1). **Sorted Sets**: Unique elements with scores, range queries. Choose by use case and access pattern.


77. What is eventual consistency? How does it relate to the CAP theorem? Explain when eventual consistency is acceptable vs when strong consistency is required. - 0

**Answer:** **Eventual consistency**: System eventually becomes consistent, not immediately. **CAP theorem**: Can only guarantee 2 of 3 (Consistency, Availability, Partition tolerance). Acceptable for: Caching, read-heavy workloads, non-critical data. **Strong consistency** needed for: Financial transactions, account data.


### Basic NoSQL Modeling (3 Questions)
**Difficulty: Medium to Hard**

78. Explain the concept of denormalization in NoSQL databases. When and why would you duplicate data across documents? - 0.5

**Answer:** **Denormalization**: Duplicate data across documents for better read performance. **When**: Frequent joins would be required, read performance critical, data doesn't change often. **Why**: Avoid joins, reduce number of queries, optimize for query patterns.


79. How would you design a schema for a social media application (users, posts, comments, likes) in a document database? Consider query patterns and performance. - 0

**Answer:** **Schema design**: Embed posts in user document (embedding), but separate comments (referencing large collections). Use indexes on frequently queried fields (user_id, post_id, timestamp). Consider aggregation pipelines for complex queries.


80. What are sharding and replication in NoSQL databases? How do they differ between document databases and key-value stores? What challenges do they introduce?

**Answer:** **Sharding**: Horizontal partition across machines (improves scale). **Replication**: Copy data to multiple nodes (improves availability). **Document DBs**: Automatic sharding, replica sets. **Key-value stores**: Consistent hashing, replication groups. **Challenges**: Rebalancing, consistency across shards.

## REST API Design Answers (Questions 81-92)


---

## 7. REST API Design (12 Questions)

### REST API Design (3 Questions)
**Difficulty: Medium to Hard**

81. Explain the principles of RESTful API design. What makes an API truly RESTful? Discuss resources, HTTP methods, and status codes. (0) - 1

**Answer:** **REST principles**: Stateless, resource-based URIs, HTTP methods (GET/POST/PUT/DELETE), status codes (200/201/404/500), hypermedia (HATEOAS), caching. Resource = noun (not verb), methods = actions. Use proper status codes for responses.


82. What is HATEOAS? Explain how it applies to REST APIs. Provide examples of how HATEOAS improves API discoverability. (0) - 0

**Answer:** **HATEOAS**: Hypermedia as the Engine of Application State - responses include links to related resources. **Benefits**: Self-discoverable APIs, decoupled clients, API evolution. **Example**: Response includes links to available actions.


83. Explain the concept of API versioning. What are the different versioning strategies (URL, header, content negotiation)? When would you use each? (0) - 1

**Answer:** **URL versioning**: /api/v1/users (explicit, cache-friendly). **Header versioning**: Accept: application/vnd.api+json;version=1 (clean URLs). **Content negotiation**: Accept header (flexible). Use URL for breaking changes, headers for gradual evolution.


### OpenAPI (3 Questions)
**Difficulty: Medium to Hard**

84. What is OpenAPI/Swagger? How does it differ from WADL and WSDL? Explain the benefits of API-first development with OpenAPI. - 1

**Answer:** **OpenAPI**: Standard API documentation format (formerly Swagger). **vs WADL/WSDL**: More readable, code generation support, version 3.x more powerful. **Benefits**: API-first development, generate documentation, client SDKs, mock servers, validation.


85. How would you document a REST API using OpenAPI? What are the key sections of an OpenAPI specification? Explain `components`, `paths`, and `schemas`.

**Answer:** **OpenAPI structure**: **components** (schemas, reusable), **paths** (endpoints), **schemas** (data models), **servers** (base URLs). Document using annotations (@Api, @ApiOperation) or manually write YAML/JSON. Use tools: Swagger UI, ReDoc for rendering.


86. Explain how to generate client SDKs and server stubs from OpenAPI specifications. What tools would you use?

**Answer:** **Generate from OpenAPI**: Use openapi-generator or swagger-codegen. Generates: Client SDKs (Java, Python, etc.), server stubs (skeleton code), documentation. Tools: OpenAPI Generator, Swagger Codegen, Bump.sh, Stoplight.


### Error Handling (3 Questions)
**Difficulty: Medium to Hard**

87. How would you design error handling for a REST API? Explain the structure of error responses (status codes, error messages, error codes). - 1

**Answer:** **Error structure**: { "error": { "code": "ENOTFOUND", "message": "Resource not found", "details": {} } }. Use status codes: 400 (client error), 404 (not found), 500 (server error). Include error codes for client handling, stack traces only in debug mode.


88. What are common HTTP status codes in REST APIs (2xx, 4xx, 5xx)? When should you use each? Explain idempotency and how it relates to status codes. - 2

**Answer:** **Status codes**: 2xx (success: 200/201/204), 4xx (client errors: 400/401/403/404), 5xx (server errors: 500/503). **Idempotency**: Same request produces same result (GET, PUT, DELETE should be idempotent). Use idempotency keys for POST requests that create resources.


89. How would you handle partial failures in distributed systems? Explain compensating transactions and idempotency keys.

**Answer:** **Partial failures**: In distributed systems, some components may fail while others succeed. **Compensating transactions**: Undo completed steps when later steps fail (Saga pattern). **Idempotency keys**: Allow safe retries, uniquely identify operations, prevent duplicate processing.


### Versioning (3 Questions)
**Difficulty: Medium to Hard**

90. Explain different API versioning strategies. What are the pros and cons of versioning in URLs vs headers? How would you implement backward compatibility? - 0

**Answer:** **Versioning strategies**: URL (/v1, /v2) vs Header (version in header). **Pros**: URL explicit but clutters, Header clean but hidden. **Backward compatibility**: Don't remove endpoints immediately, support multiple versions, use deprecation warnings, sunset deprecated versions.


91. How would you deprecate an API version? Explain the deprecation lifecycle and communication strategy. (0) - 0

**Answer:** **Deprecation lifecycle**: Add deprecation header, update docs, notify users, support for grace period, remove after timeline. **Communication**: Announcement, timeline, migration guide, support channel. Use Deprecation HTTP header or Sunset header for removal date.


92. What is the difference between breaking and non-breaking changes in API design? How would you ensure backward compatibility during API evolution? - 

**Answer:** **Breaking**: Removes fields, changes types, removes endpoints. **Non-breaking**: Adds fields (optional), adds endpoints, extends enumerations. **Ensure compatibility**: Version in URL/header, don't remove fields, additive changes, use envelope pattern, maintain old version alongside new.

## Message Brokers Answers (Questions 93-104)


---

## 8. Message Brokers (12 Questions)

### Kafka Basics (6 Questions)
**Difficulty: Medium to Hard**

93. Explain the architecture of Apache Kafka. What are brokers, topics, partitions, and offsets? How does Kafka ensure message ordering? (1) - 1 (basics only he knows)

**Answer:** **Kafka architecture**: **Brokers**: Kafka servers, store partitions. **Topics**: Logs of messages. **Partitions**: Split topic for parallelism. **Offsets**: Message position in partition. **Ordering**: Guaranteed within partition only. Messages in partition are strictly ordered.


94. What are consumer groups in Kafka? How do they enable parallel processing and load balancing? Explain rebalancing. - 0.5

**Answer:** **Consumer groups**: Multiple consumers work together. **Load balancing**: Kafka assigns partitions to consumers in group (each partition consumed by one consumer). **Rebalancing**: Triggered when consumers join/leave group, reassigns partitions. Parallel processing via consumer instances.


95. Explain the difference between `at-most-once`, `at-least-once`, and `exactly-once` semantics in Kafka. How does Kafka achieve exactly-once delivery?

**Answer:** **At-most-once**: May lose messages (best performance). **At-least-once**: May duplicate (acknowledge after processing). **Exactly-once**: Exactly once delivery (idempotent producer + transactional consumer). Use transaction API with idempotent producer for exactly-once.


96. What is the difference between `auto.offset.reset` settings (`earliest`, `latest`, `none`)? How does log compaction work in Kafka?

**Answer:** **auto.offset.reset**: **earliest** (from beginning), **latest** (new messages only), **none** (fail if no valid offset). **Log compaction**: Keeps latest value per key for each partition. Enables event sourcing patterns, reduces storage.


97. How would you handle message consumption failures in Kafka? Explain strategies for retry, dead-letter queues, and idempotent processing.

**Answer:** **Failure handling**: **Retry** with exponential backoff, **Dead letter queue** for failed messages, **Idempotent processing** to handle duplicates. Strategies: Retry topic, DLQ pattern, circuit breaker for downstream failures.


98. Explain Kafka replication and leader election. What is the ISR (In-Sync Replicas) and how does it ensure fault tolerance?

**Answer:** **Replication**: Copies data across multiple brokers (replicas). **Leader election**: One leader per partition handles writes/reads, replicas follow. **ISR** (In-Sync Replicas): Replicas that are up-to-date. **Fault tolerance**: If leader fails, controller elects new leader from ISR.


### RabbitMQ Fundamentals (3 Questions)
**Difficulty: Medium to Hard**

99. Explain RabbitMQ architecture (exchanges, queues, bindings, routing keys). What are the different exchange types (direct, topic, fanout, headers)? - 1

**Answer:** **RabbitMQ architecture**: **Exchanges**: Route messages based on type. **Queues**: Store messages. **Bindings**: Links exchanges to queues. **Exchange types**: **Direct** (routing key match), **Topic** (pattern matching), **Fanout** (broadcast), **Headers** (header attributes). **Routing key**: Used for routing.


100. What is the AMQP protocol? How does it differ from JMS? Explain message acknowledgment and publisher confirms in RabbitMQ. -1

**Answer:** **AMQP**: Advanced Message Queuing Protocol (wire-level protocol). **vs JMS**: AMQP is wire protocol, JMS is API. AMQP broker-agnostic. **Acknowledgment**: Consumer acks receipt (auto/manual). **Publisher confirms**: Producer gets confirmation of delivery. Reliable messaging.


101. How would you implement message prioritization and TTL (time-to-live) in RabbitMQ? What are different queue types and their use cases?

**Answer:** **Prioritization**: Use priority field in message properties. **TTL**: Set expiration on message or queue. **Queue types**: Classic (reliable), Quorum (consensus-based), Lazy (disk-memory). Choose based on durability and performance needs.


### Message Patterns (3 Questions)
**Difficulty: Medium to Hard**

102. Explain pub-sub, point-to-point, and request-reply messaging patterns. When would you use each pattern?

**Answer:** **Pub-sub**: Multiple consumers receive all messages (fanout). **Point-to-point**: Only one consumer per message (work queue). **Request-reply**: Send request, receive reply (RPC-like). Use pub-sub for broadcasting, p2p for workload distribution, request-reply for RPC.


103. What is the Saga pattern? How does it help manage distributed transactions? Provide an example use case. - 0

**Answer:** **Saga pattern**: Coordinates multiple services in distributed transaction via local transactions and compensating actions. **Use cases**: E-commerce orders (create order, reserve inventory, charge payment - rollback if any fails). No 2PC, eventually consistent.


104. Explain the difference between synchronous and asynchronous communication. When would you choose message queues over REST APIs? - 1

**Answer:** **Synchronous**: Blocking, immediate response, tight coupling. **Asynchronous**: Non-blocking, deferred processing, loose coupling. **Choose queues when**: Need decoupling, want reliability, can accept eventual consistency, high-volume processing, background jobs.

## Testing Answers (Questions 105-116)


---

## 9. Testing (12 Questions)

### Unit Testing (4 Questions)
**Difficulty: Medium to Hard**

105. Explain the AAA pattern (Arrange, Act, Assert) in unit testing. What makes a good unit test? Discuss test independence and test data management.(0) - 2

**Answer:** **AAA**: Arrange (setup), Act (execute), Assert (verify). **Good unit test**: Fast, independent, repeatable, self-validating, timely. **Test data**: Use @BeforeEach setup, fixtures, builders, avoid shared mutable state.


106. What is the difference between unit testing and integration testing? When would you write unit tests vs integration tests? (1) - 1

**Answer:** **Unit test**: Tests single unit in isolation (mock dependencies), fast, local. **Integration test**: Tests component interactions, uses real dependencies, slower. Write unit tests for logic, integration for interactions, both are important.


107. Explain test doubles (mock, stub, spy, fake, dummy). When would you use each type? Provide examples.

**Answer:** **Test doubles**: Mock (verify interactions), Stub (return canned data), Spy (partial mock, real object), Fake (working implementation), Dummy (unused parameter). Use Mock for verifying, Stub for data, Spy when you need real behavior.


108. What are parameterized tests and when would you use them? Explain how to test private methods (and whether you should). - 2

**Answer:** **Parameterized tests**: Run same test with different inputs (@ParameterizedTest). Use for testing multiple inputs. **Private method testing**: Don't - test public interface only. If you need to test private methods, they might need to be extracted/refactored.


### Integration Testing (4 Questions)
**Difficulty: Medium to Hard**

109. How would you test a REST API? Explain tools like TestRestTemplate, MockMvc, and WireMock. When would you use each? - 0

**Answer:** **TestRestTemplate**: Spring helper, tests actual HTTP. **MockMvc**: Mock HTTP layer, faster, MVC-centric. **WireMock**: Mock external HTTP services. Use TestRestTemplate for integration, MockMvc for unit/controller testing, WireMock for external dependencies.


110. What is the TestContainers library? How does it help with integration testing? Explain how to test against a real database without mocking.

**Answer:** **TestContainers**: Integration testing with real databases in Docker containers. Start container for test, test against real DB, clean up after. Enables testing real SQL, migrations, transactions without mocking. Lifecycle managed automatically.


111. How would you test transactional behavior in integration tests? Explain `@Transactional` annotation in test context and `@DirtiesContext`.

**Answer:** **@Transactional**: Rolls back transaction after test (test isolation). **@DirtiesContext**: Signals Spring to reload context (after test modifies singleton). Use transactional for data isolation, DirtiesContext when test modifies Spring context state.


112. Explain the difference between `@Mock`, `@MockBean`, and `@SpyBean` in Spring testing. When would you use each? - 0

**Answer:** **@Mock** (Mockito): Regular mock, framework-agnostic. **@MockBean** (Spring): Mock for Spring context, replaces bean. **@SpyBean** (Spring): Partial mock in Spring context. Use @MockBean/SpyBean when testing Spring components that need Spring context.

## CI/CD Answers (Questions 117-125)


### Mocking (4 Questions)
**Difficulty: Medium to Hard**

113. Explain Mockito framework basics. How do you verify interactions and stub behavior? What are the limitations of mocking? - 1

**Answer:** **Mockito**: Java mocking framework. **Stub**: when().thenReturn(), when().thenThrow(). **Verify**: verify(mock).method() to check method was called. **Limitations**: Cannot mock final/private methods, cannot mock static (needs MockedStatic), requires proper setup.

114. What is the difference between `when().thenReturn()` and `doReturn().when()` in Mockito? When would you use each?

**Answer:** **when().thenReturn()**: Normal stubbing, readable, better IDE support. **doReturn().when()**: Bypasses spying, avoids calling real method on spy. Use doReturn().when() for spy objects when you don't want real method called, when().thenReturn() for regular mocks.

115. How would you test exception scenarios and verify that exceptions are thrown? Explain `doThrow()` and `assertThrows()`. - 0

**Answer:** **doThrow()**: Stub to throw exception: doThrow(MyException.class).when(mock).method(). **assertThrows()** (JUnit 5): Assert exception is thrown: assertThrows(MyException.class, () -> code()). Use for testing error handling paths.

116. What is argument capturing in Mockito? Explain `ArgumentCaptor` and when you would use it.

**Answer:** **ArgumentCaptor**: Captures arguments passed to mocks. **Usage**: ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class); verify(mock).method(captor.capture()); String arg = captor.getValue(). **When**: Need to verify argument value, complex assertions on arguments, debugging.

---

## 10. CI/CD (9 Questions)

### CI Pipelines (5 Questions)
**Difficulty: Medium to Hard**

117. Explain the fundamentals of CI/CD pipelines. What are the typical stages of a CI pipeline (build, test, quality checks, deploy)? (0) - 1

**Answer:** **CI/CD stages**: Build (compile, dependency resolution), Test (unit/integration), Quality (lint, coverage, security), Package (create artifacts), Deploy (to environments). Automation ensures consistency, catches issues early.


118. What is a Jenkins Pipeline? Explain declarative vs scripted pipelines. How would you structure a multi-stage pipeline with parallel execution? - 1

**Answer:** **Jenkins Pipeline**: Code-as-configuration for Jenkins jobs. **Declarative** (structured syntax) vs **Scripted** (Groovy flexibility). **Parallel execution**: Use parallel block to run stages concurrently (test suites, deployments).


119. What are GitHub Actions and GitLab CI? How do they compare to Jenkins? When would you choose one over another? - 0

**Answer:** **GitHub Actions**: Integrated with GitHub, YAML-based, free for public repos. **GitLab CI**: Built into GitLab, integrated issues. **Jenkins**: Powerful, plugin ecosystem, self-hosted. Choose based on platform (GitHub/GitLab), features needed, team size.


120. How would you handle secrets management in CI/CD pipelines? Explain best practices for storing and using credentials (API keys, passwords, tokens). - 1

**Answer:** **Secrets management**: Use secret managers (Vault, AWS Secrets), never hardcode, use masked variables in CI/CD, rotate regularly. **Best practices**: Environment-specific secrets, least privilege, audit access, encrypt at rest. Use CI/CD secret features.


121. What is the concept of infrastructure as code in CI/CD? Explain tools like Terraform and Ansible in the context of CI/CD. - 0.5

**Answer:** **Infrastructure as Code**: Define infrastructure in code. **Terraform**: Declarative IaC, provider-agnostic, state management. **Ansible**: Automation, configuration management. Use in CI/CD to provision environments, ensure consistent infrastructure, version control infrastructure.


### Build & Release (4 Questions)
**Difficulty: Medium to Hard**

122. Explain Maven and Gradle build lifecycle. What are the phases and goals? How do they handle dependency management? - 1

**Answer:** **Maven lifecycle**: validate, compile, test, package, verify, install, deploy. **Gradle**: Tasks (custom), phases (initialization, configuration, execution). **Dependency management**: Central repos (Maven Central), transitive dependencies, version resolution, conflict resolution. Declarative dependencies.


123. What are build artifacts (JAR, WAR, EAR files)? Explain shading, fat JARs, and executable JARs. When would you use each? - 

**Answer:** **Artifacts**: JAR (library/application), WAR (web app), EAR (enterprise). **Fat JAR**: Includes dependencies (shade/assembly). **Executable JAR**: Main-Class manifest. **Shading**: Relocates packages to avoid conflicts. Use fat JAR for distribution, executable for standalone apps.


124. Explain semantic versioning (major.minor.patch). How would you implement versioning in a Maven/Gradle project? What is the difference between SNAPSHOT and release versions?

**Answer:** **Semantic versioning**: MAJOR.MINOR.PATCH. **Maven/Gradle**: Define version in pom.xml/build.gradle. **SNAPSHOT**: Development versions (volatile). **Release**: Final versions (immutable). SNAPSHOT updates fetch latest, Release caches locally.


125. What is blue-green deployment and canary deployment? How would you implement zero-downtime deployments? Explain health checks and rollback strategies. - 1

**Answer:** **Blue-green**: Two identical environments (old/new), switch traffic. **Canary**: Gradual rollout to subset of users. **Zero-downtime**: Health checks before switch, graceful shutdown, load balancer switchover. **Rollback**: Keep old version, switch back on failure.

## Docker Answers (Questions 126-137)


---

## 11. Docker (12 Questions)

### Docker Basics (6 Questions)
**Difficulty: Medium to Hard**

126. Explain Docker architecture (images, containers, Dockerfile, daemon, client). What is the difference between an image and a container? - 2

**Answer:** **Docker architecture**: **Images** (layered templates), **Containers** (running instances), **Dockerfile** (build instructions), **Docker daemon** (background service), **Client** (CLI). **Difference**: Image is template/blueprint, Container is running instance from image.


127. What is a Dockerfile? Explain the key instructions (FROM, RUN, COPY, ADD, CMD, ENTRYPOINT) and their best practices. - 2

**Answer:** **Dockerfile instructions**: **FROM** (base image), **RUN** (execute during build), **COPY** (copy files, prefer over ADD), **ADD** (copy+extract archives), **CMD** (default command), **ENTRYPOINT** (fixed entry point). **Best practices**: Minimize layers, use .dockerignore, run as non-root, use specific tags.


128. Explain Docker layering and caching. How does Docker build images from layers? What are the implications for image size and build time? - 0

**Answer:** **Layering**: Each instruction creates a layer (read-only), changes create new layers. **Caching**: Reuse unchanged layers from cache (faster builds). **Implications**: Order matters (put frequently changing layers last), larger images (more layers), immutability (layers don't change).


129. What is the difference between `CMD` and `ENTRYPOINT` in Dockerfile? How would you create a parameterized image? - 0

**Answer:** **CMD**: Default command that can be overridden. **ENTRYPOINT**: Fixed command with parameters. **Difference**: ENTRYPOINT defines executable, CMD provides defaults. **Parameterized**: Use ENTRYPOINT + CMD, or build arguments, or compose with environment variables.


130. Explain Docker networking (bridge, host, overlay networks). How do containers communicate with each other and with the host? - 0

**Answer:** **Docker networks**: **Bridge** (default, isolated network), **Host** (host's network stack), **Overlay** (multi-host Swarm). **Communication**: Containers on same bridge network communicate by name, expose ports to host, use network aliases.


131. What are volumes and bind mounts in Docker? Explain the difference and when you would use each. How would you persist data in containers? - 1

**Answer:** **Volumes**: Named storage managed by Docker. **Bind mounts**: Host path mounted into container. **Difference**: Volumes portable, bind mounts path-dependent. **Persistence**: Use volumes for data that survives container lifecycle (databases, logs).


### Containerization (3 Questions)
**Difficulty: Medium to Hard**

132. What is the difference between virtual machines and containers? Explain the concept of containerization and its advantages. - 0.5

**Answer:** **VMs**: Full OS, virtualization, heavier, more isolated. **Containers**: Shared OS kernel, lighter, faster startup, less isolated. **Containerization advantages**: Resource efficiency, fast startup, easy deployment, consistent environments, microservices-friendly.


133. Explain Docker multi-stage builds. How do they reduce image size? Provide an example use case. - 1

**Answer:** **Multi-stage builds**: Use multiple FROM statements, intermediate stages for building, final stage for runtime. **Reduces size**: Only copy necessary files to final stage, discard build tools. **Use case**: Compile code in intermediate stage, copy binary to minimal runtime image.


134. How would you optimize Docker images for production? Discuss image size, security scanning, and minimal base images. - 0

**Answer:** **Optimization**: Use minimal base images (Alpine, distroless), avoid unnecessary packages, combine RUN commands, use .dockerignore, scan for vulnerabilities. **Security**: Non-root user, minimal surface area, regular updates, signed images.


### Images (3 Questions)
**Difficulty: Medium to Hard**

135. Explain Docker image repositories and registries (Docker Hub, private registries). How would you tag and version images? (1) - 1

**Answer:** **Registries**: Centralized image storage (Docker Hub, private registries). **Tagging**: Use semantic versioning (v1.0.0), latest tag for latest build. **Versioning**: Tag images on release, avoid mutable tags in production.


136. What is image vulnerability scanning? How would you ensure the security of your Docker images? Explain strategies for keeping images updated. (0) - 0

**Answer:** **Vulnerability scanning**: Automated scanning for known CVEs in base images/dependencies. **Security**: Use Snyk, Trivy, Clair scanners. **Update strategy**: Base images, rebuild regularly, pin versions, automated scanning in CI.


137. Explain the difference between distroless images and Alpine Linux images. When would you use each? What are the security implications?

**Answer:** **Distroless**: No shell, no package manager, minimal attack surface (just runtime). **Alpine**: Lightweight base (5MB) with shell, busybox tools. **Security**: Distroless more secure (no attack surface), Alpine functional but includes shell. Use distroless for production, Alpine for debugging.

## Security Answers (Questions 138-149)


---

## 12. Security (12 Questions)

### Authentication & Authorization (4 Questions)
**Difficulty: Medium to Hard**

138. Explain the difference between authentication and authorization. What are common authentication mechanisms (basic, OAuth 2.0, JWT, SAML)? (0.5) (struggling) - 2

**Answer:** **Authentication**: Verifying identity (who you are). **Authorization**: Permissions (what you can do). **Mechanisms**: Basic (username/password), OAuth 2.0 (token-based delegation), JWT (stateless tokens), SAML (XML for SSO). Choose based on use case.


139. What is OAuth 2.0? Explain the authorization code flow, client credentials flow, and resource owner password credentials flow. When would you use each? (1) - 0

**Answer:** **OAuth 2.0 flows**: **Authorization code** (web apps, secure), **Client credentials** (machine-to-machine), **Resource owner password** (trusted apps, deprecated). **When**: Code for web apps, credentials for services, use standard flows.


140. What are JWT (JSON Web Tokens)? Explain the structure (header, payload, signature) and how they work. What are the security considerations? - 1

**Answer:** **JWT structure**: Header (algorithm), Payload (claims), Signature (HMAC or RSA). **How**: Stateless, self-contained, Base64URL encoded. **Security**: Sign with secret/private key, validate signature, check expiration, use HTTPS only.


141. Explain role-based access control (RBAC) and attribute-based access control (ABAC). How would you implement authorization in a Spring Boot application?

**Answer:** **RBAC**: Roles assigned to users, permissions tied to roles. **ABAC**: Attributes determine access (location, time, resource). **Implementation**: Spring Security with @PreAuthorize, MethodSecurityExpressionHandler, custom expressions.


### Secure Coding (4 Questions)
**Difficulty: Medium to Hard**

142. What is the difference between encoding, encryption, and hashing? Explain symmetric vs asymmetric encryption. When would you use each?

**Answer:** **Encoding**: Base64 (not encryption, just representation). **Encryption**: Scrambles data (AES symmetric, RSA asymmetric). **Hashing**: One-way function (bcrypt, SHA). **Symmetric**: Same key (AES), **Asymmetric**: Public/private key (RSA). Use encryption for secrets, hashing for passwords.


143. What are common security vulnerabilities in web applications? Explain SQL injection, XSS (Cross-Site Scripting), and CSRF (Cross-Site Request Forgery). - 0.5

**Answer:** **SQL Injection**: Malicious SQL via user input. **XSS**: Injecting scripts via input (reflected/stored). **CSRF**: Forged requests from trusted users. **Prevent**: Parameterized queries, input validation, output encoding, CSRF tokens, Content Security Policy.


144. How would you handle sensitive data in application configuration? Explain secrets management, environment variables, and configuration encryption. - 1

**Answer:** **Secrets management**: Use vaults (HashiCorp Vault, AWS Secrets Manager), never hardcode. **Environment variables**: For config, not true secrets. **Encryption**: Encrypt at rest (database fields), in transit (TLS). Rotate regularly.


145. Explain the principle of least privilege. How would you implement secure password storage? Discuss password hashing algorithms (bcrypt, Argon2). - 0

**Answer:** **Least privilege**: Minimum permissions needed. **Password storage**: Never store plaintext, use bcrypt/Argon2 (adaptive hashing), salt per user, high cost factor. **Bcrypt**: Widely supported. **Argon2**: Winner of PHC, more secure, memory-hard.


### OWASP (4 Questions)
**Difficulty: Medium to Hard**

146. What is OWASP Top 10? Explain the current top security risks and how they apply to Java applications.

**Answer:** **OWASP Top 10**: Top security risks (injection, broken auth, sensitive data exposure, XML external entities, broken access control, security misconfig, XSS, insecure deserialization, vulnerable components, insufficient logging). Apply fixes: Input validation, secure defaults, logging/monitoring.


147. What is dependency vulnerability scanning? How would you identify and fix vulnerabilities in your project dependencies? Explain tools like OWASP Dependency-Check and Snyk.

**Answer:** **Dependency scanning**: Automated detection of vulnerable dependencies. **Tools**: OWASP Dependency-Check, Snyk, Dependabot, Clair. **Process**: Scan in CI, fix reported vulnerabilities, keep dependencies updated, use security advisories.


148. Explain the difference between SAST (Static Application Security Testing) and DAST (Dynamic Application Security Testing). When would you use each? - 0

**Answer:** **SAST**: Static analysis (source code scanning). **DAST**: Dynamic analysis (runtime testing). **When**: SAST during development, DAST for runtime behavior. Use both for comprehensive security coverage.


149. How would you implement input validation and output encoding to prevent injection attacks and XSS? Provide examples.

**Answer:** **Input validation**: Whitelist approach, validate format, sanitize user input. **Output encoding**: Encode for HTML (prevent XSS), URL encoding, context-aware encoding. **Example**: Use PreparedStatement for SQL, HTML entity encoding, parameterized queries.

## Elasticsearch Answers (Questions 150-158)


---

## 13. Elasticsearch (9 Questions)

### Elasticsearch Basics (3 Questions)
**Difficulty: Medium to Hard**

150. Explain Elasticsearch architecture (nodes, clusters, shards, replicas). How does Elasticsearch ensure fault tolerance and scalability? - 1

**Answer:** **Architecture**: **Nodes** (servers), **Clusters** (collection of nodes), **Shards** (horizontal partitions), **Replicas** (copies for redundancy). **Fault tolerance**: Automatic failover, replica placement, shard reallocation on node failure.


151. What is an inverted index? How does Elasticsearch store and search documents? Explain the relationship between indices, types, and documents.

**Answer:** **Inverted index**: Maps terms to documents (like book index). **Storage**: Documents stored, indexed via inverted index for fast search. **Indices**: Collections of documents. **Types**: Deprecated in 6.0+. **Documents**: JSON objects.


152. Explain the difference between Elasticsearch and Solr. When would you choose one over the other? What are their use cases? - 

**Answer:** **Elasticsearch**: JSON-based, RESTful, better for schema-less data, real-time search, often used with ELK stack. **Solr**: XML-based, more mature, better text search features. **Choose**: Use Elasticsearch for flexibility, Solr for traditional text search features.


### Indexing (3 Questions)
**Difficulty: Medium to Hard**

153. What is document mapping in Elasticsearch? Explain dynamic mapping vs explicit mapping. How would you design mappings for different data types?

**Answer:** **Mapping**: Schema definition (fields, types). **Dynamic**: Auto-detect and create mappings. **Explicit**: Define mappings manually. **Design**: Specify field types (text, keyword, date), define analyzers, control indexing behavior.


154. Explain index templates and index aliases in Elasticsearch. When would you use each? How do they enable zero-downtime reindexing?

**Answer:** **Templates**: Pre-defined index structure applied to new indices. **Aliases**: Alternate names for indices. **Zero-downtime**: Use aliases to switch indices without downtime (atomic operation). Reindex to new index, update alias.


155. What are analyzers and tokenizers in Elasticsearch? Explain the different analysis phases (character filtering, tokenization, token filtering). How would you create a custom analyzer?

**Answer:** **Analyzers**: Process text during indexing/search. **Tokenizers**: Split text into tokens. **Phases**: Character filtering → tokenization → token filtering. **Custom**: Combine tokenizer + token filters + char filters for specific needs (handling special cases).


### Search Queries (3 Questions)
**Difficulty: Medium to Hard**

156. Explain the difference between Elasticsearch query types: `match`, `term`, `range`, `bool`, `exists`, `wildcard`. When would you use each?

**Answer:** **match**: Full-text search with analysis. **term**: Exact match, not analyzed. **range**: Numeric/date range. **bool**: Combine queries (must/should/must_not). **exists**: Field exists. **wildcard**: Pattern matching. Use match for text search, term for exact, bool for complex logic.


157. What is the difference between Elasticsearch query context and filter context? Explain the performance implications and caching behavior.

**Answer:** **Query context**: Calculates scores (relevance). **Filter context**: Yes/no only, cached. **Performance**: Filters faster (cached, no scoring). **Caching**: Filter results cached, queries not cached. Use filters for yes/no checks, queries for relevance ranking.


158. Explain Elasticsearch aggregations. What are the different aggregation types (metric, bucket, pipeline)? Provide examples of practical use cases.

**Answer:** **Aggregations**: Analyze data, provide insights. **Metric** (avg, sum, stats), **Bucket** (terms, date range), **Pipeline** (nested, second-level aggregations). **Use cases**: Analytics, grouping, statistics, time-series analysis.

## Productivity & Tools Answers (Questions 159-167)


---

## 14. Productivity & Tools (9 Questions)

### IDE Productivity (3 Questions)
**Difficulty: Medium to Hard**

159. What are the most useful IntelliJ IDEA shortcuts and features? Explain code navigation, refactoring tools, and debugging features.

**Answer:** **IDEA shortcuts**: Ctrl+Click (go to declaration), Alt+Enter (quick fix), Ctrl+Alt+L (format), Ctrl+Shift+F (find in files), Ctrl+Alt+T (surround with), Ctrl+B (go to definition). **Features**: Refactoring (extract method), debugging (breakpoints, evaluate expressions).


160. How would you configure and use multiple Git remotes in your IDE? Explain the benefits of using both GitHub and GitLab remotes.

**Answer:** **Git remotes**: Push to different remotes, use remotes for backup, different hosting. **Configuration**: git remote add upstream <url>, git push origin <branch>, git push backup <branch>. Multiple remotes for redundancy, collaboration.


161. What are code formatters and how would you configure them? Explain tools like Checkstyle, Spotbugs, and SonarLint integration.

**Answer:** **Code formatters**: Automatic code formatting (Google Java Style, 120 columns). **Tools**: Checkstyle (style checker), SpotBugs (bug patterns), SonarLint (code smells). **Integration**: In IDEA plugins, pre-commit hooks, CI/CD enforcement.


### Debugging (3 Questions)
**Difficulty: Medium to Hard**

162. Explain breakpoint types in IntelliJ IDEA (line, conditional, exception, method). How would you debug a multi-threaded application? - 0

**Answer:** **Breakpoint types**: Line (at line), Conditional (condition), Exception (catch exceptions), Method (method entry). **Multi-threaded debugging**: Thread-specific breakpoints, "Suspend all threads" option, step over vs step into to control flow.


163. What are remote debugging and hot swapping in Java? How would you debug a production application without impacting users?

**Answer:** **Remote debugging**: Connect JVM remotely (start with debug options, attach debugger). **Hot swap**: Change code at runtime (limited to method bodies). **Production**: Use sparingly, adds overhead, requires firewall access. Use for emergency debugging only.


164. How would you analyze memory dumps and heap dumps? Explain tools like jmap, jhat, and VisualVM for debugging memory issues.

**Answer:** **Memory analysis**: jmap (generate heap dumps), jhat (basic analyzer), VisualVM (GUI profiler), Eclipse MAT (advanced analysis). **Debugging**: Use heap dumps to find memory leaks, analyze object retention, GC roots.

## Software Engineering Practice Answers (Questions 168-176)


### Build Tools (3 Questions)
**Difficulty: Medium to Hard**

165. Compare Maven vs Gradle. What are the key differences in terms of build performance, flexibility, and dependency management?

**Answer:** **Maven**: XML-based, declarative, standardized lifecycle, slower builds. **Gradle**: Groovy/Kotlin DSL, imperative, faster (incremental builds), more flexible. **Performance**: Gradle faster due to daemon, caching. **Flexibility**: Gradle more programmable. Both use similar dependency management concepts.

166. Explain dependency resolution in Maven/Gradle. What are the different scopes (compile, runtime, test)? How does version conflict resolution work?

**Answer:** **Scopes**: **compile** (build + runtime), **provided** (build-time only), **runtime** (runtime only), **test** (test compile). **Conflict resolution**: Nearest dependency wins, transitive dependencies resolved recursively. Use dependency tree to debug conflicts, use exclusions to control transitive deps.

167. How would you create and publish a custom Maven/Gradle plugin? Explain the plugin development lifecycle and testing.

**Answer:** **Maven plugin**: Implement Mojo interface, use @Mojo annotation, bundle as JAR. **Gradle plugin**: Implement Plugin interface, register tasks. **Publish**: Deploy to repo (Maven Central, local repo). **Testing**: Integration tests with plugin as dependency. **Lifecycle**: Write, test locally, publish, version.

---

## 15. Software Engineering Practices (9 Questions)

### Code Review (3 Questions)
**Difficulty: Medium to Hard**

168. What are the key aspects of a good code review? Explain what to look for (code quality, security, performance, maintainability).

**Answer:** **Code review aspects**: Correctness, security, performance, maintainability, test coverage, documentation. Look for: Bugs, security issues, code smells, performance problems, readability.


169. How would you review code for common issues (null safety, exception handling, resource management, concurrency)? Provide examples.

**Answer:** **Review checks**: Null safety (Optional, null checks), exception handling (proper catch/rethrow), resource management (try-with-resources), concurrency (thread-safety, race conditions). **Examples**: Missing null check, unreleased locks, unchecked exceptions.


170. Explain the code review workflow in Git-based development. How would you handle merge conflicts and provide constructive feedback?

**Answer:** **Review workflow**: Push to branch, create PR, reviewers comment, fix issues, merge. **Conflicts**: Rebase to avoid, resolve in merge tool. **Feedback**: Be constructive, explain why, provide examples, be respectful. Use PR templates.


### Documentation (3 Questions)
**Difficulty: Medium to Hard**

171. What are the best practices for writing code documentation? Explain when to use comments vs documentation. When are `@param` and `@return` annotations necessary?

**Answer:** **Documentation practices**: Javadoc for public APIs, explain why not what, keep docs up to date, use @param @return. **Comments**: Use for complex logic, TODOs, important notes. **Necessary**: For public APIs, complex algorithms, business logic.


172. How would you document APIs using Javadoc and external tools? Explain the importance of API documentation and examples.

**Answer:** **API documentation**: Javadoc for method signatures, Swagger/OpenAPI for REST APIs. **Importance**: Helps consumers, enables SDK generation, contract definition. **Examples**: Include usage examples, parameter descriptions, response formats.


173. What is a README and what should it contain? How would you create comprehensive project documentation for new developers?

**Answer:** **README contents**: Project description, setup instructions, usage examples, configuration, troubleshooting. **Project docs**: Architecture diagrams, contributing guidelines, deployment procedures, on-call runbooks. Make it easy for new developers.


### On-call Basics (3 Questions)
**Difficulty: Medium to Hard**

174. What are the key responsibilities of an on-call engineer? Explain incident response procedures and escalation paths. - 1

**Answer:** **On-call responsibilities**: Respond to alerts, page team leads, investigate issues, escalate if needed, document incidents. **Incident response**: Triage, mitigate, resolve, post-mortem. **Escalation**: Follow runbooks, contact on-call manager for critical issues.


175. How would you diagnose a production issue? Explain the debugging process, logging, monitoring, and metrics analysis.

**Answer:** **Diagnose process**: Check logs (tail, grep), query metrics (Prometheus, Grafana), check dashboards, reproduce locally if possible. **Debugging**: Start broad (all metrics), narrow down (specific service), check recent changes, use APM tools.


176. What is a post-mortem and how would you conduct one? Explain the blameless culture and how to prevent similar incidents.

**Answer:** **Post-mortem**: Document incident (what happened, impact, cause, timeline). **Blameless culture**: Focus on process, not people. Learn from incident, prevent recurrence. **Action items**: Fix root cause, add monitoring, update runbooks.

## Data Management Answers (Questions 177-185)


---

## 16. Data Management (9 Questions)

### PII Handling (6 Questions)
**Difficulty: Medium to Hard**

177. What is PII (Personally Identifiable Information)? Explain the regulations (GDPR, CCPA) and their implications for software development. (0) - 1

**Answer:** **PII**: Personally Identifiable Information (name, email, SSN, etc.). **Regulations**: GDPR (EU), CCPA (California). **Implications**: Need consent, right to access/deletion, data protection, breach notification requirements. Implement data governance.


178. How would you implement data anonymization and pseudonymization in your applications? Provide code examples.

**Answer:** **Anonymization**: Remove identifying information permanently. **Pseudonymization**: Replace with pseudonym (reversible with key). **Code**: Encrypt PII fields, use hashing (SHA-256 with salt), tokenization (replace with tokens). Implement data masking.


179. What is data encryption at rest and in transit? How would you implement field-level encryption for sensitive data? (0) - 1

**Answer:** **Encryption at rest**: Database encryption, file encryption. **Encryption in transit**: TLS for network communication. **Field-level**: Encrypt specific database columns, use application-level encryption libraries. Use AES-256 for sensitive fields.


180. Explain the concepts of data minimization and purpose limitation. How would you ensure your application only collects necessary data?

**Answer:** **Data minimization**: Collect only necessary data. **Purpose limitation**: Use data only for stated purpose. **Implementation**: Limit input fields, don't request SSN unless required, auto-expire data when no longer needed. Privacy by design.


181. How would you implement consent management and data subject rights (access, deletion, portability) in a Java application?

**Answer:** **Consent management**: Track user consent, consent withdrawal. **Subject rights**: **Access** (export data), **Deletion** (right to be forgotten), **Portability** (export data). **Implementation**: API endpoints for each right, audit logs, secure access.


182. What are the security considerations when handling PII in logs? How would you prevent sensitive data from being logged? (1)

**Answer:** **Security in logs**: Never log PII (passwords, SSNs, credit cards). **Prevention**: Use log sanitizers, redaction, avoid logging sensitive fields, use logging filters. Check log files before release, use centralized logging.


### Retention Policies (3 Questions)
**Difficulty: Medium to Hard**

183. What are data retention policies? Why are they important? How would you implement automated data deletion based on retention rules? - 0

**Answer:** **Retention policies**: How long to keep data per regulations/business needs. **Importance**: Compliance, storage costs, security. **Implementation**: Scheduled jobs to delete old data, archive first, audit trail. Use Quartz or Spring scheduling.


184. How would you implement data archival before deletion? Explain strategies for moving old data to cheaper storage. - 0

**Answer:** **Archival strategy**: Move old data to cold storage (S3 Glacier, tape), then delete from hot storage. **Implementation**: Export to archival format, compress, move to cheaper storage, verify, delete original. Balance cost vs retrieval needs.


185. How would you ensure compliance with retention policies across different data stores (databases, logs, backups)? Explain challenges and solutions.

**Answer:** **Compliance challenges**: Multiple data stores (DB, logs, backups, analytics), different retention rules. **Solutions**: Centralized retention management, policy engine, automated processes, audit logging, data inventory. Use governance tools.

## Artifact Management Answers (Questions 186-194)


---

## 17. Artifact Management (9 Questions)

### Artifact Repos (3 Questions)
**Difficulty: Medium to Hard**

186. What are artifact repositories (Nexus, Artifactory, Docker Registry)? Explain their purpose in a software development lifecycle.

**Answer:** **Artifact repositories**: Store build artifacts (Nexus, Artifactory, Docker Registry). **Purpose**: Centralized storage, version management, dependency resolution, release management. Part of DevOps pipeline, enables reproducible builds.


187. How would you configure Maven/Gradle to publish artifacts to a repository? Explain the difference between snapshots and releases.

**Answer:** **Publishing**: Configure in pom.xml/build.gradle (distributionManagement/repositories). **Snapshots**: Mutable dev versions (may change). **Releases**: Immutable final versions. Use snapshots for development, releases for production.


188. What is the difference between a proxy, hosted, and group repository? Explain the repository layout and organization.

**Answer:** **Proxy**: Cache external repos (speed, offline). **Hosted**: Store your artifacts. **Group**: Aggregate multiple repos (composite view). **Layout**: Maven2, Ivy, generic. Organize by artifact type, version, stage.


### Versioning (3 Questions)
**Difficulty: Medium to Hard**

189. Explain semantic versioning in detail. How would you implement versioning for a library vs an application? What is the difference between API versioning and implementation versioning?

**Answer:** **Semantic versioning**: MAJOR.MINOR.PATCH (breaking.adding.fixing). **Library**: Version by API changes. **Application**: Version by features. **API versioning**: Manage separately from implementation versioning. Tag releases in Git.


190. How would you handle version dependencies and updates? Explain strategies for managing transitive dependencies and breaking changes.

**Answer:** **Version dependencies**: Declare versions in parent POM or version catalog. **Updates**: Use bom (Bill of Materials) for aligned versions. **Breaking changes**: Semantic versioning communicates changes. Use dependency plugin to check for updates.


191. What is Git tags and how do they relate to artifact versioning? How would you automate versioning from Git history?

**Answer:** **Git tags**: Mark releases in Git repo. **Relation**: Tags should match artifact versions. **Automation**: CI/CD tags on release, tag with semantic version. Use git describe to generate version strings.


### Multi-module Releases (3 Questions)
**Difficulty: Medium to Hard**

192. Explain Maven/Gradle multi-module projects. How would you manage dependencies between modules and handle version alignment? (0)

**Answer:** **Multi-module**: Parent POM manages versions, child modules inherit. **Dependencies**: Declare in parent, inherit in children. **Version alignment**: Use parent POM or dependencyManagement for consistent versions across modules.


193. What are version catalogs in Gradle? How do they simplify dependency management across multiple modules?

**Answer:** **Version catalogs** (Gradle): Centralized dependency versions in catalogs file. **Simplifies**: Single source of truth, type-safe access, easier updates. Reduces duplication, enables dependency sharing.


194. How would you release all modules in a multi-module project with consistent versioning? Explain the Maven release plugin and alternatives.

**Answer:** **Multi-module release**: Version all modules together, single version for all. **Strategies**: Maven Release Plugin (versions:set, commit, tag), Gradle release plugin, or custom scripts. **Consistent**: Keep all modules at same version to avoid confusion.


---

## Scoring Guidelines

### Point Distribution (Total: 194 Questions)
- **Core Java**: 15 points (Questions 1-15)
- **JVM & Performance**: 12 points (Questions 16-27)
- **Concurrency & Async**: 16 points (Questions 28-43)
- **Spring Framework**: 16 points (Questions 44-59)
- **Relational Databases**: 12 points (Questions 60-71)
- **NoSQL**: 9 points (Questions 72-80)
- **REST API**: 12 points (Questions 81-92)
- **Message Brokers**: 12 points (Questions 93-104)
- **Testing**: 12 points (Questions 105-116)
- **CI/CD**: 9 points (Questions 117-125)
- **Docker**: 12 points (Questions 126-137)
- **Security**: 12 points (Questions 138-149)
- **Elasticsearch**: 9 points (Questions 150-158)
- **Productivity & Tools**: 9 points (Questions 159-167)
- **Software Engineering**: 9 points (Questions 168-176)
- **Data Management**: 9 points (Questions 177-185)
- **Artifact Management**: 9 points (Questions 186-194)

### Scoring Rubric (per question)
- **0 points**: No answer or completely incorrect
- **1 point**: Basic understanding, missing key concepts
- **2 points**: Good understanding with some gaps
- **3 points**: Excellent understanding, thorough explanation with examples

### Grade Scale (out of 582 total points)
- **A+ (Excellent)**: 524-582 points (90-100%)
- **A (Very Good)**: 465-523 points (80-89%)
- **B (Good)**: 408-464 points (70-79%)
- **C (Satisfactory)**: 349-407 points (60-69%)
- **D (Needs Improvement)**: 291-348 points (50-59%)
- **F (Insufficient)**: Below 291 points (<50%)

### Evaluation Notes
- Ask follow-up questions to probe deeper when answers are superficial
- Reward practical experience and real-world examples
- Pay attention to understanding of when/why, not just what
- Consider the candidate's ability to explain concepts to others

