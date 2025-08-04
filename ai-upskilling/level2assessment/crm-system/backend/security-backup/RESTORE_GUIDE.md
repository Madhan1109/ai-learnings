# Security Configuration Restoration Guide

## When to Restore

After testing the frontend functionality with the backend services, you should restore the security configurations to their original state.

## Files to Restore

### 1. API Gateway
**File:** `backend/api-gateway/src/main/java/com/crm/apigateway/config/SecurityConfig.java`
**Restore from:** `backend/security-backup/api-gateway-SecurityConfig-original.java`

**Changes to revert:**
- Replace `.anyExchange().permitAll()` with the original authentication configuration

### 2. Auth Service
**File:** `backend/auth-service/src/main/java/com/crm/authservice/config/WebSecurityConfig.java`
**Restore from:** `backend/security-backup/auth-service-WebSecurityConfig-original.java`

**Changes to revert:**
- Replace `.anyRequest().permitAll()` with the original specific endpoint permissions

### 3. Sales Service
**File:** `backend/sales-service/src/main/java/com/crm/salesservice/config/SecurityConfig.java`
**Action:** Delete this file entirely (it was created for testing)

### 4. Analytics Service
**File:** `backend/analytics-service/src/main/java/com/crm/analyticsservice/config/SecurityConfig.java`
**Action:** Delete this file entirely (it was created for testing)

### 5. Notification Service
**File:** `backend/notification-service/src/main/java/com/crm/notificationservice/config/SecurityConfig.java`
**Action:** Delete this file entirely (it was created for testing)

## Restoration Steps

1. **Stop all services:**
   ```bash
   docker-compose down
   ```

2. **Restore API Gateway SecurityConfig:**
   - Copy content from `backend/security-backup/api-gateway-SecurityConfig-original.java`
   - Replace the content in `backend/api-gateway/src/main/java/com/crm/apigateway/config/SecurityConfig.java`

3. **Restore Auth Service WebSecurityConfig:**
   - Copy content from `backend/security-backup/auth-service-WebSecurityConfig-original.java`
   - Replace the content in `backend/auth-service/src/main/java/com/crm/authservice/config/WebSecurityConfig.java`

4. **Delete testing security configs:**
   ```bash
   rm backend/sales-service/src/main/java/com/crm/salesservice/config/SecurityConfig.java
   rm backend/analytics-service/src/main/java/com/crm/analyticsservice/config/SecurityConfig.java
   rm backend/notification-service/src/main/java/com/crm/notificationservice/config/SecurityConfig.java
   ```

5. **Rebuild and restart services:**
   ```bash
   docker-compose up --build
   ```

6. **Update frontend authentication:**
   - Ensure the frontend includes proper JWT authentication headers
   - Update API calls to include Authorization headers
   - Test login flow and token management

## Security Considerations

After restoration:
- All endpoints will require proper authentication
- JWT tokens must be included in API requests
- Unauthorized requests will return 401/403 errors
- CORS will be properly configured for authenticated requests

## Testing After Restoration

1. Test login functionality
2. Verify JWT token generation and validation
3. Test API calls with proper authentication headers
4. Verify that unauthorized requests are properly rejected
5. Test CORS with authenticated requests

## Emergency Rollback

If you need to quickly re-enable testing mode:
1. Copy the modified files from this backup
2. Restart the services
3. The frontend will work without authentication again 