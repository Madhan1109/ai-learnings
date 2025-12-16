# Senior Developer Evaluation Questions

## Evaluation Scoring Template

Use the table below to capture answers and assign a score per question.

| S.No | Question | Answers | Score (0-3) |
|---|---|---|---|
| 1 |  |  |  |

Scoring: 0 = No answer, 1 = Basic, 2 = Good, 3 = Excellent.

## 1. Advanced Java (Java 8–25)
1. Explain the key differences and implications between Java 8 Streams API and Java 17 or later Structured Concurrency API.

**Answer:** Java 8 Streams are for data processing pipelines (functional, often parallel), but do not manage thread lifecycles directly. Structured Concurrency (Java 19+ incubator, Java 21 preview) provides a structured approach to managing lifetimes and hierarchies of concurrent tasks, using constructs like StructuredTaskScope. This allows for safer cancellation, error propagation, and better debuggability. You get cleaner code for fan-out/fan-in, as opposed to manual fork-join or ExecutorServices.

2. How would you troubleshoot a memory leak in a high-throughput Java microservice? What JVM tools would you use?

**Answer:** Use heap dumps (jmap, jcmd), then analyze with VisualVM, Eclipse MAT, or jhat. Monitor with `-XX:+HeapDumpOnOutOfMemoryError`. Use `jconsole`/`jvisualvm` for live memory/GC trends. Track growing objects, unintentional retention (static fields, caches), and thread stacks. Correlate with code changes and GC logs for allocation rate spikes.

3. Describe in detail the differences between var, record, and sealed classes in modern Java. When would you use each?

**Answer:** `var` is local type inference, only for variables. `record` is a special class for immutable data carriers with compact syntax (auto constructor, equals/hashCode/toString). `sealed` classes restrict which classes can extend them (compiler-enforced hierarchy, for pattern matching safety). Use `var` for brevity in locals, `record` for DTOs/immutable value objects, `sealed` for enums-like extensibility but with richer data/behavior.

4. What are the pitfalls of using CompletableFuture and how do you debug deadlocks or resource starvation in async pipelines?

**Answer:** Pitfalls: Swallowing exceptions (use exceptionally/handle), unintentional thread pool blocking (do not block in async lambdas), thread leaks. Debug by capturing and inspecting dependent stages, enabling async stack traces with JVM flags, using thread dumps and executor metrics. Resource starvation often arises when blocking code runs on common pool or limited executor.

5. Explain the working and use cases of Virtual Threads in Java 21+. How do they impact scalability?

**Answer:** Virtual Threads (Project Loom, Java 21+) allow lightweight, user-mode scheduled threads, each with its own stack, managed by the JVM but multiplexed on carrier (platform) threads. Enables scaling to millions of concurrent tasks without thread exhaustion. Use for I/O-bound, massive concurrency apps (HTTP servers, messaging, simulations). They drastically simplify async code: you write blocking code, but it's lightweight and scales well. Still, beware of native/blocking calls and thread-local pitfalls.

## 2. Spring & Spring Boot Internals
6. Explain in detail the lifecycle of a Spring Bean and how advanced lifecycle hooks (e.g., SmartLifecycle, BeanPostProcessor) work together.

**Answer:** Spring Bean lifecycle: instantiation -> properties set -> Aware interfaces -> @PostConstruct/InitializingBean -> BeanPostProcessor pre/post-init -> use -> @PreDestroy/DisposableBean. BeanPostProcessors can wrap, proxy, or alter beans. SmartLifecycle adds startup/shutdown callbacks for ordered bean graphs (useful for async resources, event-driven apps). Combining these enables robust, observable component management.

7. How does Spring AOP proxy creation differ between JDK dynamic proxies and CGLIB proxies? What are real-world implications?

**Answer:** JDK proxies require interfaces. CGLIB proxies subclass concrete classes. CGLIB is used when there’s no interface, but can break final/private method logic and can interfere with serialization or constructors. JDK proxies are more lightweight but limited. Spring chooses automatically, but explicit mode is possible. Real-world: beware unexpected behaviors if you rely on subclass-specific or non-overridable methods.

8. When configuring a large-scale Spring Boot app, what are best practices for managing configuration properties and secrets—especially in cloud environments?

**Answer:** Use hierarchical property sources (application.yml/properties, profiles, environment vars), with profiles for environment-specific settings. For secrets, use externalized configuration: inject via environment variables, cloud secrets managers (AWS Secrets Manager, Azure Key Vault), or Kubernetes secrets. Never store secrets in source control. Prefer Spring Cloud Config or Vault integration for central config and rotation.

9. Describe advanced scenarios for Conditional Beans (@Conditional annotations): how can you combine multiple complex conditions?

**Answer:** Custom `@Conditional` logic (extending Condition class) allows you to activate beans based on bean presence, property values, or environment. Compose multiple with meta-annotations, or cascade with AND/OR logic inside your Condition code. Useful for portable starter modules, environment feature toggles, or hybrid cloud/local deployments.

10. Explain the class loading process in Spring Boot fat jars. How does it affect custom classloader implementation?

**Answer:** Spring Boot fat jars use a special `LaunchedURLClassLoader` that handles JAR-in-JAR. This wraps multiple JARs in one big executable. Custom classloaders must account for the nested jar structure. Class/resource loading order can change. Reflection and instrumentation (agents, code reloading) must integrate with this hierarchy, or they may miss classes or fail to transform/instrument code properly.

## 3. J2EE Design Patterns
11. Describe the Factory Method design pattern implementation in a modern Spring Boot application, using generics and reflection.

**Answer:** Factory Method in modern Spring Boot often uses interfaces, generics, and Spring-managed beans. Example: define a Factory interface with a generic type parameter, inject bean/type metadata, and return an instance using ApplicationContext.getBean(type)/reflection. Reflection/generics allow runtime binding (e.g., instantiate handler per event type). Use @ComponentFactory and @Autowired for type-safe factory resolution.

12. How would you ensure thread-safety when implementing a Singleton pattern in a distributed J2EE system?

**Answer:** For local thread safety: Use `enum` singleton, or double-checked locking with volatile, or Spring singleton beans (managed by context). Distributed: Use a shared datastore (e.g., Hazelcast, Redis, DB) with locks for cross-JVM coordination, or leader election (Zookeeper, Consul) for “single active” semantics. Never trust JVM-only Singleton for global uniqueness in distributed systems.

13. Distinguish between classic DAO and repository abstractions in layered Java enterprise architectures—what are the trade-offs?

**Answer:** DAOs separate persistence layer and encapsulate SQL/connection details. Repository (DDD) is more domain-driven, focused on aggregates/entities and offers a richer, intention-revealing API (less SQL-exposed). DAOs are more flexible for direct DB ops. Repository pattern works well with Spring Data, supporting testing and event sourcing. Repositories, however, can be leaky abstractions if forced over highly procedural/legacy DBs.

14. How can MVC be extended to support multi-tenancy in a cloud-native microservice? Give a high-level design.

**Answer:** Pass tenant context via HTTP headers or subdomain, resolve in middleware/interceptor, then propagate to service/DAO. Use separate schemas or row-based tenant ID partitioning. Leverage Spring’s `@Scope("tenant")` or custom scopes. Use multi-tenant-aware datasources, caches, and avoid global statics. Propagate tenant context asynchronously/logically throughout the request/thread.

15. How would you design and enforce an advanced Dependency Injection scheme supporting runtime plugin/module injection?

**Answer:** Use Spring’s ApplicationContext hierarchies: load plugins as child contexts or classloaders, hot-reload via `ConfigurableApplicationContext`. Register beans/modules dynamically with BeanDefinitionRegistry. Enforce module boundaries via interface contracts, use conditional autowiring, and version/plugin metadata. Optionally expose plugin API via OSGi, ServiceLoader, or Spring SPI/FactoryBean. Testability: inject plugin points, use mocks and stubs for contracts.

## 4. Testing (Unit, Integration, TDD, BDD)
16. What is mutation testing (e.g., PIT) and how does it improve over just code coverage tools like Jacoco?

**Answer:** Mutation testing randomly mutates code and checks if tests fail—measures test quality, not just presence. Jacoco ensures lines/branches are run, but mutations identify “survivors” (untested logic or weak assertions). PIT (pitest.org) automates mutation/gene testing for JVM projects—excellent for exposing “false confidence” from superficial test coverage metrics.

17. Explain integration test strategies for external systems (databases, message brokers) using Docker Compose or Testcontainers.

**Answer:** Use Testcontainers to spin up actual instances of databases/brokers in disposable containers as part of test lifecycle. Docker Compose lets you define test integration environments for local or CI use. Prefer Testcontainers for Java-friendly test lifecycle and Compose for cross-language stacks. Clean up between tests, seed known state, and parallelize containers for isolation.

18. In a BDD-oriented project, how do you handle brittle scenarios in Cucumber or JBehave and foster maintainable acceptance criteria?

**Answer:** Keep step definitions DRY, map to intent not exact wordings, factor common setup to hooks. Use data tables and scenario outlines to avoid copy-paste. Involve stakeholders in scenario reviews. Refactor or delete outdated steps promptly. Automate integration with living documentation portals for business visibility.

19. Design a unit test for a legacy static utility class with private constructors and static state.

**Answer:** Make state injectable if possible. For existing legacy: use PowerMock/Mockito-inline to mock statics or reset state before/after each test via reflection. Use coverage tools to confirm test effectiveness. Ensure private constructor is covered with explicit test: use reflection to invoke it and assert instantiation defense (e.g., throws exception).

20. What are the trade-offs between end-to-end testing and contract testing in distributed microservice systems?

**Answer:** End-to-end tests verify the entire call chain, exposing integration issues, but are slow, flaky, and hard to maintain at scale. Contract testing (e.g., Pact, Spring Cloud Contract) validates APIs independently (provider/consumer), offers faster, isolated feedback and avoids combinatorial explosion of E2E tests, but may not catch wiring/config/classpath or data propagation bugs across the full stack.

## 5. Build Tools & Dependency Management
21. Explain the Maven build lifecycle vs Gradle’s task graph. How do you optimize multi-module builds for large codebases?

**Answer:** Maven build lifecycle is a sequence of phases (validate, compile, test, package, verify, install, deploy) with goals bound to lifecycle steps. Gradle uses a DAG task graph—tasks can be run in any order, support fine-grained incremental and parallel execution. Optimize multi-module builds by parallel execution, fine-grained dependencies between modules, and using Gradle’s build cache and configuration avoidance APIs; in Maven, use reactor (–T for threads), incremental build, and isolate slow modules.

22. How would you create and invoke a custom Maven or Gradle plugin for code generation or check enforcement?

**Answer:** Create a Maven plugin by implementing Mojo interface and annotating with @Mojo, then bind to goal in pom.xml. Gradle: create a Plugin class, register tasks via project.extensions, bundle in buildSrc or a standalone JAR. Invoke: add dependency and configure in build file (pom.xml/plugins or build.gradle/plugins). For code-gen/enforcement add <execution> block (Maven) or task hook (Gradle) at right build phase (generate-sources, check, etc).

23. In a polyglot project (Java/Kotlin/Scala), what are challenges and solutions for dependency convergence and shading fat jars?

**Answer:** Challenges: version conflicts (transitive dependencies resolving differently between JVM languages), classpath hell, and plugin incompatibilities. Solution: enforce versions with dependencyManagement (Maven) or resolutionStrategy (Gradle), favor fat/shaded jars (Maven Shade, Gradle Shadow) to relocate and avoid clashes, keep third-party dependencies layer separated if possible, and test combined artifact end-to-end. CI: test all language modules in integration builds.

24. How can you secure your artifact pipelines against supply chain dependency attacks?

**Answer:** Pin dependency versions; use version locks (gradle.lockfile, Maven’s versions plugin), use dependency scanning tools (OWASP Dependency-Check, Snyk, GitHub Dependabot), restrict artifact downloads to trusted repositories (Nexus proxy, Maven Central), sign artifacts, and use two-person review for build config changes. Enforce checksum verification and audit build and release process (SBOM: Software Bill of Materials).

25. Describe how dependency version conflicts are diagnosed and resolved in complex transitive dependency graphs.

**Answer:** Use Maven’s dependency:tree or Gradle’s dependencies task to visualize the full graph, note "first-wins" (Maven) or "nearest-wins" (Gradle) versions. Explicitly exclude unwanted versions (exclusions block or exclude group/module), align with dependency constraints (Maven’s dependencyManagement, Gradle’s version catalogs). For hard cases, inspect difference in resolved class files/versions at runtime, or use build analysis tools (jdeps, Classpath Hell tools).

## 6. Relational Databases (RDBMS)
26. How would you tune SQL queries and indexes for high-concurrency OLTP workloads in PostgreSQL or MySQL?

**Answer:** Analyze query plans (EXPLAIN ANALYZE), add covering indexes, tune index clustering and partitioning, design to avoid full scans, minimize locking/row contention using optimistic concurrency controls. Use connection poolers, monitor slow query and lock logs, and profile with instrumentation. Normalize for OLTP write scaling, denormalize judiciously for reads (if justified).

27. Discuss approaches for implementing distributed transactions (XA) and compensating transactions in Java.

**Answer:** XA provides two-phase commit (2PC) via JTA TransactionManager and resource adapters. Use with care in microservices—expensive, brittle at scale. Prefer saga (compensating transaction) patterns: break transaction into steps, fire events or compose compensating actions for rollback. Frameworks: Spring TransactionManager (XA), Axon/Saga for compensation, custom workflow engine for orchestration.

28. Describe a migration strategy for zero-downtime schema changes in large, live databases.

**Answer:** Use expand-contract: add new schema (nullable/optional columns, tables), deploy app to read/write both (dual writes), migrate data in background, verify, then remove old columns/tables after cutover. Use DB migration tools (Flyway, Liquibase), automate with CI/CD, test roll-back plans, monitor schema and data consistency with health checks.

29. Explain the pros and cons of using stored procedures versus ORMs in mission-critical systems.

**Answer:** Stored procedures provide closer-to-data logic, performance benefits (reduced network round-trips, plan caching, security boundaries). Cons: hard to version/test, less portable, risk of business logic lock-in. ORMs (JPA, Hibernate) improve testability, portability, and modeling, but can generate inefficient queries and hide DB-specific tuning opportunities.

30. How would you enforce and audit data encryption-at-rest for a Java application using an enterprise RDBMS?

**Answer:** Use native RDBMS features (TDE: Transparent Data Encryption in Oracle/MSSQL/Postgres). Ensure DB is configured with encrypted tablespaces and keys. For column-level: use DB-side encryption or encrypt data in Java before persistence (javax.crypto, JCE). Audit via DB audit logs, monitor encryption config (CI runs compliance scripts), and rotate keys regularly.

## 7. NoSQL & Distributed Data
31. Compare the scaling strategies between sharded MongoDB clusters and Elasticsearch indices. What are the unique challenges?

**Answer:** MongoDB sharding involves splitting collections by shard key across replica sets; scaling both reads/writes but requires careful key selection to prevent hotspotting, and managing chunk migrations. Elasticsearch: each index is divided into shards, auto-balanced and replicated, best for search/analytics. Elasticsearch tuning: shard count/capacity, rebalancing, managing cluster state. Unique Mongo challenges: balancing/resharding; ES: index mapping bloat, cluster splits.

32. How do you manage consistency and failover in distributed Redis or Memcached setups?

**Answer:** Use Redis Sentinel (auto-failover for masters), Redis Cluster for partitioning, tune replica sync and persistence to trade off durability vs performance, monitor link health. In Memcached, manage failover at client (reconnect on failure, consistent hash remapping). Employ client-side retry/pooling, and set sensible timeout/failure policies to avoid thundering herd on disconnect.

33. Design a multi-index Elasticsearch query scenario that balances precision ranking and high throughput logging analytics.

**Answer:** Use index aliases for time-based index rollover (hot/warm architecture). Aggregate low-latency queries into dedicated search indices, redirect bulk logging to daily indices. Tune queries to use filters (cacheable) versus scoring queries (ranking), use shallow pagination (search_after), and combine must/should clauses judiciously for speed. Use rollups for massive history and ILM for index lifecycle.

34. What are the design patterns for eventual consistency across mixed SQL/NoSQL applications?

**Answer:** Implement event sourcing, or use change data capture (CDC) to emit domain events upon persistence. Use message brokers for async sync (Kafka Connect, Debezium). Leverage idempotent consumers, versioned writes, reconciliation/background sync for healing. Compensating transactions (sagas) are critical to handle divergent states.

35. Explain backup and disaster recovery planning for clustered NoSQL deployments.

**Answer:** Take regular point-in-time and snapshot backups (using system tools or storage-level snapshots, e.g., mongodump, elasticsearch-snapshots, managed service APIs). Validate and test restores regularly. Plan recovery point objectives (RPO) and recovery time objectives (RTO). Store backups offsite/region. Automate as part of maintenance runbooks and use role-based access to protect backup data.

## 8. Caching Strategies
36. How would you architect a hybrid caching strategy combining server-side Redis/Memcached and client-side browser storage for a single-page app?

**Answer:** Cache static or personalized data at the server edge in Redis or Memcached, propagate cache TTLs to frontend (HTTP headers, cache-control, ETag). On client, use LocalStorage/IndexedDB for offline and recent data, Service Workers for background sync or prefetching. Use cache busting/versioning. Invalidate server-side cache on writes, push invalidation events to the client.

37. What are the risks of stale data in distributed caches and how do you use cache invalidation patterns to mitigate these risks?

**Answer:** Risks: serving outdated/incorrect info, inconsistent business logic, data loss. Mitigation: apply TTLs, use write-through or write-behind, employ event-driven invalidation (PubSub), implement cache-aside patterns. In high-consistency needs, use distributed locks or version tokens. Monitor cache hit/miss, and stale/age metrics for auditing.

38. Describe how to provide strong consistency guarantees in a highly-available, eventually-consistent caching system.

**Answer:** Use distributed consensus protocols (e.g., Redis RedLock, ZooKeeper, Consul) for resource/leadership locks. Layer cache invalidation on top of WAL/ledger. For critical paths, use “read-through on miss, then write-through on update,” or require version checking and optimistic locking on concurrent updates.

39. How would you monitor and alert on cache performance and hit/miss rates at scale?

**Answer:** Expose metrics via built-in cache tools or external metrics exporters (Redis INFO, Memcached stats, Caffeine/Guava metrics); scrape and aggregate in Prometheus/Grafana, DataDog, or ELK. Alert on Miss Rate, Evictions, Memory Utilization, Latency, and QPS with threshold- and anomaly-based rules. Correlate spikes to application events/releases.

40. When would you choose an embedded cache (like Caffeine) over a distributed cache?

**Answer:** Use embedded cache for very low-latency, in-process scenarios (session caching per node, hot local computations), where data fits in-memory and local invalidation (or reboot) is acceptable. Prefer distributed cache for shared, consistency-required, large/partitioned data, cross-process or scaling with redundancy.

## 9. Version Control, Collaboration & Code Quality
41. What are advanced GitHub workflow patterns (e.g., trunk-based, gitflow, monorepo) and their pros/cons for large teams?

**Answer:** Trunk-based: few long-lived branches, fast integration, hard to scale for large, independent teams. Gitflow: stable master, develop, feature/release/hotfix—predictable, but branchy and slower to integrate. Monorepo: one repo for many services, encourages code sharing but needs tooling for scale. Microrepo: independent ownership, risk of duplicated effort/coordination hazards.

42. How do you integrate Jacoco code coverage checks into a CI/CD pipeline with PR enforcement?

**Answer:** Configure Jacoco Maven/Gradle plugin to generate XML/HTML reports as part of build. In CI/CD: parse Jacoco output, fail build or block PR if below threshold (use GitHub Actions, Jenkins, SonarCloud integration, or Codecov for auto-commenting PRs). Automate trend statistics (badge, dashboard) for transparency.

43. Discuss strategies for handling and resolving complex merge conflicts in long-lived branches or multiple releases.

**Answer:** Prefer frequent rebasing or small PRs to avoid conflicts. For longstanding divergences, use three-way merge and merge drivers; do targeted merges for high-risk modules first. Reserve a dedicated fix/integration branch for complex cases, and establish strict CI and code review on merges. For release branches, test cutover merges in staging, and use rebase onto main to maintain history.

44. What are practical approaches for automating code review quality gates leveraging GitHub Actions?

**Answer:** Deploy status checks for builds, tests, linters, security scans; require PR approval enforcement, review required labels/states, auto-tag reviewers for domain/component. Use custom GitHub Actions for policy checks (e.g., banned APIs, commit message format); integrate SonarCloud, Danger.js, or similar for post-review feedback.

45. How do you manage secret rotation and policy enforcement in public open source repos on GitHub?

**Answer:** Never commit secrets in code; use automated tools (GitHub secret scanning, truffleHog). Use environment secrets for CI. Rotate secrets on exposure, and automate revocation notifications. Policy enforcement: enable branch protections, review, and set up Dependabot Alerts and CODEOWNERS for security-critical paths.

## 10. Containerization, Messaging & Cloud
46. Describe a robust Docker build strategy for minimizing image size, supporting multi-arch builds, and reproducible deployments.

**Answer:** Use multi-stage builds to isolate runtime from build-time dependencies. Start with FROM scratch or Alpine, add only what’s necessary. Use `docker buildx` for multi-architecture, pin base image digests for reproducibility. Avoid ADD/COPY wildcards, purge build cache, sort installs (layer re-use). Generate SBOM and scan for CVEs.

47. How would you securely handle inter-service communication in a Kubernetes-managed microservice using message brokers?

**Answer:** Use mutual TLS (via service mesh like Istio/Linkerd) to encrypt communication. Broker-level authentication (SASL, cert-based auth), per-service RBAC/ACLs. Use network policies to restrict message broker access. Rotate credentials/secrets using Kubernetes Secrets or Vault. Monitor all ingress/egress and audit message topics.

48. Explain high-throughput Kafka consumer tuning for order guarantees, dead-letter handling and strict idempotency.

**Answer:** Tune number of partitions for parallelism (beware: more partitions = less strict order). For order, consume single partition per consumer group member, commit offsets explicitly after handling. Configure dead-letter topics for failed events (with error handler/consumer for resend/analysis). For idempotency: enforce idempotent keys and deduplicate via external store or Kafka’s transactional APIs.

49. Design a cloud-native CI/CD pipeline using Jenkins, GitHub Actions, OR a cloud-native tool (AWS/Azure) for blue/green deployments with rollback.

**Answer:** Use declarative pipeline: build, test, scan, and containerize; deploy to green environment with health checks. Route traffic via load balancer (ALB, NGINX) after validation. Monitor metrics (rollback if failed health checks or error rates spike). Automate rollback to last healthy version with versioned artifacts. Audit all actions in pipeline logs.

50. What are the key controls for implementing secure, compliant, and observable applications on AWS (pick any 2 relevant services in your discussion)?

**Answer:** (A) IAM: use least-privilege roles, rotate credentials, enable CloudTrail logging for all access. (B) VPC: use private subnets, NACLs, Security Groups, enforce traffic patterns. (C) GuardDuty/CloudWatch: real-time security/event monitoring, set up automated alerts/ECS runbook integration. 

Always encrypt S3 buckets, enforce encryption in-transit and at-rest, and regularly audit with AWS Config for compliance drift.
