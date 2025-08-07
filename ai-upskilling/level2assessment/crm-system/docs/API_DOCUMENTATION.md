# CRM System API Documentation

## Overview
This document provides comprehensive API documentation for the CRM system microservices.

## Base URLs
- **API Gateway**: `http://localhost:8080`
- **Customer Service**: `http://localhost:8081`
- **Sales Service**: `http://localhost:8082`
- **Analytics Service**: `http://localhost:8083`
- **Auth Service**: `http://localhost:8084`
- **Notification Service**: `http://localhost:8085`

## Authentication
All API endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Customer Service API

### Get All Customers
```http
GET /api/customers
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Madhan M S",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "status": "active",
    "source": "website",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Customer by ID
```http
GET /api/customers/{id}
```

### Create Customer
```http
POST /api/customers
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567891",
  "company": "Tech Solutions",
  "status": "lead",
  "source": "referral"
}
```

### Update Customer
```http
PUT /api/customers/{id}
Content-Type: application/json

{
  "name": "Jane Smith Updated",
  "email": "jane.smith@example.com",
  "phone": "+1234567891",
  "company": "Tech Solutions Inc",
  "status": "active",
  "source": "referral"
}
```

### Delete Customer
```http
DELETE /api/customers/{id}
```

## Sales Service API

### Get All Opportunities
```http
GET /api/opportunities
```

### Create Opportunity
```http
POST /api/opportunities
Content-Type: application/json

{
  "title": "Enterprise Software License",
  "customerId": 1,
  "amount": 50000.00,
  "stage": "proposal",
  "probability": 0.75,
  "expectedCloseDate": "2024-03-15"
}
```

## Analytics Service API

### Get Sales Analytics
```http
GET /api/analytics/sales
```

### Get Customer Analytics
```http
GET /api/analytics/customers
```

### Get AI Insights
```http
GET /api/analytics/insights
```

## Auth Service API

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin"
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

## Notification Service API

### Get Notifications
```http
GET /api/notifications
```

### Mark as Read
```http
PUT /api/notifications/{id}/read
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limiting
- **Standard endpoints**: 1000 requests per hour
- **Analytics endpoints**: 100 requests per hour
- **Auth endpoints**: 10 requests per minute

## Pagination
For list endpoints, use query parameters:
- `page`: Page number (default: 0)
- `size`: Page size (default: 20, max: 100)
- `sort`: Sort field (default: id)
- `direction`: Sort direction (asc/desc, default: asc)

Example:
```http
GET /api/customers?page=0&size=10&sort=name&direction=asc
```

## WebSocket Events

### Real-time Notifications
```javascript
// Connect to WebSocket
const socket = io('http://localhost:8080');

// Listen for notifications
socket.on('notification', (data) => {
  console.log('New notification:', data);
});

// Listen for customer updates
socket.on('customer-updated', (data) => {
  console.log('Customer updated:', data);
});
```

## SDK Examples

### JavaScript/TypeScript
```javascript
import { CRMClient } from '@crm/sdk';

const client = new CRMClient({
  baseURL: 'http://localhost:8080',
  token: 'your-jwt-token'
});

// Get customers
const customers = await client.customers.getAll();

// Create customer
const newCustomer = await client.customers.create({
  name: 'Madhan M S',
  email: 'john@example.com'
});
```

### Python
```python
from crm_sdk import CRMClient

client = CRMClient(
    base_url='http://localhost:8080',
    token='your-jwt-token'
)

# Get customers
customers = client.customers.get_all()

# Create customer
new_customer = client.customers.create({
    'name': 'Madhan M S',
    'email': 'john@example.com'
})
``` 