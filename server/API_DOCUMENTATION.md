# Backend API Documentation

## Overview

This is a production-ready REST API built with Node.js, Express.js, and MySQL. It follows MVC architecture with reusable CRUD patterns.

## Base URL

```
http://localhost:9005/api
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Request successful |
| `201` | Created - Resource created |
| `400` | Bad Request - Invalid input |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Duplicate email/unique constraint |
| `500` | Server Error - Internal error |

## Users API

### Base Path: `/api/users`

#### 1. Get All Users (Paginated)

```
GET /api/users
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `search` (string) - Search by name or email
- `sortBy` (string) - Column to sort by
- `order` (string) - 'asc' or 'desc' (default: 'asc')

**Example Request:**
```bash
curl "http://localhost:9005/api/users?page=1&limit=10&search=john"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0100",
      "status": "active",
      "created_at": "2024-01-15T10:30:45.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

#### 2. Get Single User

```
GET /api/users/:id
```

**URL Parameters:**
- `id` (number, required) - User ID

**Example Request:**
```bash
curl http://localhost:9005/api/users/1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "status": "active",
    "created_at": "2024-01-15T10:30:45.000Z",
    "updated_at": "2024-01-15T10:30:45.000Z"
  }
}
```

---

#### 3. Create User

```
POST /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0100",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "status": "active"
}
```

**Required Fields:**
- `name` (string)
- `email` (string, unique)

**Optional Fields:**
- `phone` (string)
- `address` (string)
- `city` (string)
- `country` (string)
- `status` (enum: 'active', 'inactive', 'blocked')

**Example Request:**
```bash
curl -X POST http://localhost:9005/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "status": "active"
  }'
```

**Example Response (201 Created):**
```json
{
  "success": true,
  "message": "users created successfully",
  "data": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "created_at": "2024-01-15T12:00:00.000Z"
  }
}
```

---

#### 4. Update User

```
PUT /api/users/:id
Content-Type: application/json
```

**URL Parameters:**
- `id` (number, required) - User ID

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "+1-555-0101",
  "status": "inactive"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:9005/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "status": "inactive"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "users updated successfully",
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "john@example.com",
    "status": "inactive",
    "updated_at": "2024-01-15T12:05:00.000Z"
  }
}
```

---

#### 5. Delete User

```
DELETE /api/users/:id
```

**URL Parameters:**
- `id` (number, required) - User ID

**Example Request:**
```bash
curl -X DELETE http://localhost:9005/api/users/1
```

**Example Response:**
```json
{
  "success": true,
  "message": "users deleted successfully",
  "data": {
    "id": 1
  }
}
```

---

#### 6. Get User Statistics

```
GET /api/users/stats
```

**Example Request:**
```bash
curl http://localhost:9005/api/users/stats
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "byStatus": {
      "active": 35,
      "inactive": 8,
      "blocked": 2
    }
  }
}
```

---

#### 7. Get Users by Status

```
GET /api/users/status/:status
```

**URL Parameters:**
- `status` (enum: 'active', 'inactive', 'blocked') - User status

**Example Request:**
```bash
curl http://localhost:9005/api/users/status/active
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "status": "active"
    }
  ]
}
```

---

#### 8. Search Users

```
GET /api/users/search
```

**Query Parameters:**
- `q` (string, required) - Search query
- `limit` (number, default: 10, max: 100) - Results limit

**Example Request:**
```bash
curl "http://localhost:9005/api/users/search?q=john&limit=5"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

---

#### 9. Bulk Update User Status

```
PATCH /api/users/bulk/status
Content-Type: application/json
```

**Request Body:**
```json
{
  "ids": [1, 2, 3],
  "status": "inactive"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:9005/api/users/bulk/status \
  -H "Content-Type: application/json" \
  -d '{
    "ids": [1, 2, 3],
    "status": "inactive"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "3 users updated successfully",
  "data": {
    "updated": 3
  }
}
```

---

## Error Examples

### Validation Error
```json
{
  "success": false,
  "error": {
    "message": "Invalid email format",
    "statusCode": 400
  }
}
```

### Duplicate Email
```json
{
  "success": false,
  "error": {
    "message": "Email already exists",
    "statusCode": 409
  }
}
```

### Not Found
```json
{
  "success": false,
  "error": {
    "message": "users not found",
    "statusCode": 404
  }
}
```

---

## Creating Additional Modules

To create a new CRUD module (e.g., Products):

### 1. Create Model (`server/models/Product.ts`)
```typescript
export interface Product {
  id?: number;
  name: string;
  price: number;
  created_at?: Date;
}

export class ProductModel {
  // Similar to UserModel
}
```

### 2. Create Controller (`server/controllers/productController.ts`)
```typescript
export class ProductController extends CRUDController<Product> {
  constructor() {
    super("products", db, "id");
  }
  // Custom methods
}
```

### 3. Create Routes (`server/routes/products.ts`)
```typescript
router.get("/", asyncHandler((req, res) => productController.getAll(req, res)));
// Other CRUD endpoints
```

### 4. Register in `server/index.ts`
```typescript
app.use("/api/products", productRoutes);
```

---

## Development Commands

```bash
# Start development server
pnpm dev

# Type check
pnpm typecheck

# Build
pnpm build

# Start production
pnpm start

# Run tests
pnpm test
```

---

## Architecture Overview

```
server/
├── config/          # Configuration files (database.ts)
├── controllers/     # Business logic (userController.ts)
├── models/          # Database models (User.ts)
├── routes/          # API routes (users.ts)
├── middleware/      # Custom middleware (errorHandler.ts)
├── utils/           # Utilities (crudController.ts)
└── index.ts         # Main server file
```

---

## Best Practices

1. **Always validate input** - Use the validation in controllers
2. **Use async/await** - All database operations use async/await
3. **Handle errors** - Use the asyncHandler wrapper for route handlers
4. **Use pagination** - For endpoints returning lists
5. **Use indexes** - On frequently searched columns
6. **Consistent naming** - Follow REST conventions
7. **Document endpoints** - Keep API docs updated

---

## Testing Endpoints

Use curl, Postman, or Thunder Client:

```bash
# Get all users
curl http://localhost:9005/api/users

# Create user
curl -X POST http://localhost:9005/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com"}'

# Update user
curl -X PUT http://localhost:9005/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated"}'

# Delete user
curl -X DELETE http://localhost:9005/api/users/1
```
