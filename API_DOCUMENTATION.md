# FreshPress API Documentation

## Overview
This is a comprehensive REST API for managing car washing services, orders, customers, and messages.

## Base URL
```
http://localhost:9005/api
```

## Authentication
Currently, authentication is client-side via local storage. In production, implement JWT or OAuth2.

---

## Users API

### GET /api/users
Get all users with pagination and search

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 10)
- `search` (optional): Search by name, email, phone, or city
- `sortBy` (optional): Column to sort by
- `order` (optional): Sort order - asc/desc (default: asc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "address": "123 Main St",
      "city": "Los Angeles",
      "zipcode": "90001",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### POST /api/users
Create a new user

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword",
  "phone": "9876543211",
  "role": "customer",
  "address": "456 Oak Ave",
  "city": "Chicago",
  "zipcode": "60601"
}
```

**Response:**
```json
{
  "success": true,
  "message": "users created successfully",
  "data": {
    "id": 51,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543211",
    "role": "customer",
    "address": "456 Oak Ave",
    "city": "Chicago",
    "zipcode": "60601",
    "is_active": true
  }
}
```

### GET /api/users/:id
Get a specific user by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

### PUT /api/users/:id
Update a user

**Body:**
```json
{
  "name": "John Smith",
  "phone": "9876543210"
}
```

### PUT /api/users/:id/status
Update user active/inactive status

**Body:**
```json
{
  "is_active": false
}
```

### DELETE /api/users/:id
Delete a user

### GET /api/users/admins
Get all admin users

### GET /api/users/active
Get all active users

---

## Services API

### GET /api/services
Get all services with pagination

**Query Parameters:**
- `page`, `limit`, `search`, `sortBy`, `order` (same as users)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Basic Car Wash",
      "description": "Complete exterior and interior wash",
      "category": "Standard",
      "price": 25.00,
      "duration_minutes": 30,
      "image_url": "/images/basic-wash.jpg",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {...}
}
```

### POST /api/services
Create a new service

**Body:**
```json
{
  "name": "Premium Detailing",
  "description": "Deep cleaning with wax and polish",
  "category": "Premium",
  "price": 75.00,
  "duration_minutes": 90,
  "image_url": "/images/premium-detail.jpg"
}
```

### GET /api/services/active
Get all active services (no pagination)

### GET /api/services/categories
Get all available categories

**Response:**
```json
{
  "success": true,
  "data": ["Standard", "Premium", "Specialty"]
}
```

### GET /api/services/stats
Get service statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 6,
    "active": 6,
    "inactive": 0,
    "avg_price": 76.67,
    "min_price": 25.00,
    "max_price": 200.00
  }
}
```

### GET /api/services/category/:category
Get services by category

### GET /api/services/:id
Get a specific service

### PUT /api/services/:id
Update a service

### DELETE /api/services/:id
Delete a service

---

## Orders API

### GET /api/orders
Get all orders with pagination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_id": 2,
      "service_id": 1,
      "service_name": "Basic Car Wash",
      "price": 25.00,
      "status": "completed",
      "scheduled_date": "2024-01-20T10:00:00Z",
      "notes": "Customer satisfied",
      "total_amount": 25.00,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {...}
}
```

### POST /api/orders
Create a new order

**Body:**
```json
{
  "customer_id": 2,
  "service_id": 1,
  "service_name": "Basic Car Wash",
  "price": 25.00,
  "status": "pending",
  "scheduled_date": "2024-01-25T14:00:00Z",
  "notes": "Urgent cleaning needed",
  "total_amount": 25.00
}
```

### GET /api/orders/pending
Get pending and confirmed orders

### GET /api/orders/stats
Get order statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "pending": 1,
    "confirmed": 1,
    "completed": 2,
    "cancelled": 1,
    "total_revenue": 195.00
  }
}
```

### GET /api/orders/customer/:customerId
Get orders for a specific customer

### GET /api/orders/status/:status
Get orders by status (pending, confirmed, in_progress, completed, cancelled)

### GET /api/orders/:id
Get order with customer details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customer_id": 2,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "9876543210",
    "customer_address": "123 Main St",
    ...
  }
}
```

### PUT /api/orders/:id
Update an order

### PUT /api/orders/:id/status
Update order status

**Body:**
```json
{
  "status": "completed"
}
```

### DELETE /api/orders/:id
Delete an order

---

## Messages API

### GET /api/messages
Get all messages with pagination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mike Wilson",
      "email": "mike@example.com",
      "phone": "9876543214",
      "message": "I would like to know more about your ceramic coating service",
      "status": "unread",
      "reply_message": null,
      "replied_at": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {...}
}
```

### POST /api/messages
Create a new message

**Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "9876543210",
  "message": "Can you provide pricing for monthly service?"
}
```

### GET /api/messages/unread
Get unread messages (no pagination)

### GET /api/messages/replied
Get replied messages (no pagination)

### GET /api/messages/stats
Get message statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 4,
    "unread": 1,
    "read": 1,
    "replied": 2
  }
}
```

### GET /api/messages/:id
Get a specific message

### PUT /api/messages/:id
Update a message

### PUT /api/messages/:id/read
Mark a message as read

### PUT /api/messages/:id/reply
Reply to a message

**Body:**
```json
{
  "reply_message": "Thank you for your interest. We offer..."
}
```

### DELETE /api/messages/:id
Delete a message

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "status": 404
  }
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

---

## Database Seeding

To populate the database with sample data, run:

```bash
npm run seed:db
```

This will create:
- 4 sample users (1 admin, 3 customers)
- 6 sample services
- 5 sample orders
- 4 sample messages

---

## Frontend Integration

Use the provided hooks in `client/hooks/`:
- `useUsers()` - User management
- `useServices()` - Service management
- `useOrders()` - Order management
- `useMessages()` - Message management

Example:
```typescript
import { useServices } from '@/hooks/useServices';

function MyComponent() {
  const { services, fetchServices, createService } = useServices();

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    // ...
  );
}
```

---

## Admin Reusable Components

Located in `client/components/admin/`:

### Table Component
- Advanced table with sorting, pagination, search
- Row actions support
- Multiple action options per row

### Form Component
- Automatic validation
- Custom validation support
- Field error handling
- Support for multiple field types

### Modal Component
- Customizable sizes (sm, md, lg, xl)
- Flexible footer with custom actions
- Backdrop click handling

### Card Component
- Header with icon and action
- Multiple variants (default, bordered, elevated, flat)
- Footer support

---

## Next Steps

1. **Authentication**: Implement JWT-based authentication
2. **Authorization**: Add role-based access control (RBAC)
3. **Validation**: Add request validation middleware
4. **Logging**: Implement comprehensive logging
5. **Testing**: Add integration tests for all endpoints
6. **Documentation**: Generate OpenAPI/Swagger documentation
