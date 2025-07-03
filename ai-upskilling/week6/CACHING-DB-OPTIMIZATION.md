# Caching Strategies and Database Optimization

## Caching Strategies
- **Redis** is used for real-time chat and pub/sub, and can be extended for:
  - User session caching
  - Frequently accessed course data
  - Quiz and assessment results
- **@Cacheable** (Spring) can be added to service methods for read-heavy endpoints (e.g., course search, user profile).
- **Cache Invalidation:**
  - On course update/delete, invalidate related cache entries.
  - On user profile update, invalidate user cache.
- **TTL (Time-to-Live):**
  - Set appropriate TTL for cached data to avoid stale reads.

## Database Optimization Plans
- **Indexes:**
  - Add indexes on frequently queried columns (e.g., username, email, courseId, userId, lessonId).
  - Example: `CREATE INDEX idx_user_username ON users(username);`
- **Connection Pooling:**
  - Use R2DBC connection pooling for PostgreSQL.
- **Query Optimization:**
  - Use pagination for large result sets (e.g., course lists, enrollments).
  - Avoid N+1 queries by using proper joins or batch fetching.
- **Schema Evolution:**
  - Use Flyway or Liquibase for database migrations in production.
- **Monitoring:**
  - Monitor slow queries using PostgreSQL logs and Prometheus metrics.
- **Partitioning (Advanced):**
  - For very large tables (e.g., progress, enrollments), consider table partitioning by user or course. 