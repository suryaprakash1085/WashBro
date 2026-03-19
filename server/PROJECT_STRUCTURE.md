# Project Structure & Architecture

## Complete Folder Layout

```
server/
├── config/
│   └── database.ts              # MySQL connection using Knex
├── middleware/
│   └── errorHandler.ts          # Error handling & async wrapper
├── models/
│   └── User.ts                  # User model with DB queries
├── controllers/
│   └── userController.ts        # Business logic (extends CRUDController)
├── routes/
│   ├── users.ts                 # User API endpoints
│   └── demo.ts                  # Demo endpoint
├── utils/
│   └── crudController.ts        # Generic CRUD base class
├── index.ts                     # Main Express server setup
├── node-build.ts                # Build configuration
├── DATABASE.md                  # SQL schemas & examples
├── API_DOCUMENTATION.md         # Complete API reference
├── GETTING_STARTED.md           # Quick setup guide
└── PROJECT_STRUCTURE.md         # This file
```

## File Descriptions

### Configuration

#### `config/database.ts`
- Knex.js database configuration
- MySQL connection with pooling
- `connectDB()` function to test connection
- Exported `db` instance for use throughout app

```typescript
export const db = knex({ /* config */ });
export async function connectDB(): Promise<void> { /* ... */ }
```

### Middleware

#### `middleware/errorHandler.ts`
- `APIError` class for custom errors
- `errorHandler()` middleware for global error handling
- `asyncHandler()` wrapper to catch async route errors
- Consistent error response format

```typescript
export class APIError extends Error { /* ... */ }
export function errorHandler(err, req, res, next) { /* ... */ }
export function asyncHandler(fn) { /* ... */ }
```

### Models

#### `models/User.ts`
- `User` interface with type definitions
- `UserModel` class with database operations
- Static methods for CRUD operations
- Custom methods like `getByStatus()`, `countByStatus()`, etc.
- Schema creation with `createTable()` method

```typescript
export interface User { /* ... */ }
export class UserModel {
  static async getAll() { /* ... */ }
  static async getById(id) { /* ... */ }
  static async create(data) { /* ... */ }
  // ... other methods
}
```

### Controllers

#### `controllers/userController.ts`
- Extends `CRUDController<User>` base class
- Overrides `applySearch()` for custom search fields
- Overrides `validateData()` for validation logic
- Custom methods like `getStats()`, `bulkUpdateStatus()`, etc.
- Form validation (email format, uniqueness checks)

```typescript
export class UserController extends CRUDController<User> {
  protected applySearch(query, term) { /* ... */ }
  protected async validateData(data) { /* ... */ }
  async getStats(req, res) { /* ... */ }
}
```

### Routes

#### `routes/users.ts`
- RESTful API endpoints
- Uses `asyncHandler()` for error handling
- Implements pagination, search, filtering
- CRUD operations and custom actions

```typescript
router.get("/", asyncHandler(userController.getAll));
router.post("/", asyncHandler(userController.create));
router.put("/:id", asyncHandler(userController.update));
router.delete("/:id", asyncHandler(userController.delete));
// ... other routes
```

### Utilities

#### `utils/crudController.ts`
- Generic `CRUDController<T>` base class
- Implements common CRUD patterns
- Pagination and sorting support
- Override hooks for search and validation
- Handles errors with `APIError`

```typescript
export class CRUDController<T> {
  async getAll(req, res) { /* ... */ }
  async getById(req, res) { /* ... */ }
  async create(req, res) { /* ... */ }
  async update(req, res) { /* ... */ }
  async delete(req, res) { /* ... */ }
  protected applySearch(query, term) { /* ... */ }
  protected async validateData(data) { /* ... */ }
}
```

### Server Entry Point

#### `index.ts`
- Express app creation and configuration
- Middleware setup (CORS, JSON parsing)
- Database connection
- Route registration
- Error handler registration (must be last)
- Server listening on PORT

```typescript
export async function createServer() {
  const app = express();
  // Setup middleware
  // Connect database
  // Register routes
  // Add error handler
  return app;
}
```

## Data Flow

### Request -> Response Flow

```
HTTP Request
    ↓
Express Middleware (CORS, JSON parsing)
    ↓
Route Handler (routes/users.ts)
    ↓
Controller Method (userController.ts)
    ↓
Validation (validateData)
    ↓
Model Operation (UserModel.create/update/delete)
    ↓
Database (MySQL via Knex)
    ↓
Response Data → Response Object
    ↓
HTTP Response (JSON)
    ↓
Error Handler (if error occurs)
```

## MVC Pattern Explanation

### Model (`models/User.ts`)
- Represents data structure
- Handles database queries
- Static methods for DB operations
- No business logic, just data

```typescript
class UserModel {
  static async create(data) { /* DB insert */ }
  static async getById(id) { /* DB select */ }
}
```

### View (Client-side)
- React components display data
- Located in `client/` folder
- Receives JSON from API

### Controller (`controllers/userController.ts`)
- Processes requests
- Calls model methods
- Validates data
- Sends responses

```typescript
class UserController extends CRUDController {
  async create(req, res) {
    // Validate
    // Call model
    // Send response
  }
}
```

### Route (`routes/users.ts`)
- Maps URLs to controller methods
- Defines HTTP methods
- Passes requests to controllers

```typescript
router.post("/", asyncHandler(userController.create));
```

## Error Handling Flow

```
Error Occurs in Route/Controller
    ↓
asyncHandler catches it
    ↓
Passes to errorHandler middleware
    ↓
APIError? Check type
    ↓
Return JSON error response
```

## Database Connection Flow

```
Server Start
    ↓
createServer() called
    ↓
connectDB() executes
    ↓
Database connection test
    ↓
UserModel.createTable() creates schema if needed
    ↓
Ready to handle requests
```

## Extending with New Module

### Example: Products Module

1. **Create Model** (`models/Product.ts`)
   - Define `Product` interface
   - Create `ProductModel` class
   - Implement database queries
   - Add `createTable()` method

2. **Create Controller** (`controllers/productController.ts`)
   - Extend `CRUDController<Product>`
   - Override `validateData()` for products
   - Add custom methods (e.g., `getByCategory()`)

3. **Create Routes** (`routes/products.ts`)
   - Define CRUD endpoints
   - Wrap handlers with `asyncHandler()`
   - Add custom route handlers

4. **Register Routes** (`index.ts`)
   - Import `productRoutes`
   - Call `ProductModel.createTable()`
   - Add `app.use("/api/products", productRoutes)`

5. **Define in API** (`shared/api.ts`)
   - Export `Product` interface for type safety

## Key Design Patterns

### 1. **Generic CRUD Controller**
Reusable base class that all controllers extend:
```typescript
class ProductController extends CRUDController<Product>
```

### 2. **Async Route Wrapper**
Catches errors in async routes:
```typescript
router.get("/", asyncHandler(controller.getAll))
```

### 3. **Template Method Pattern**
Override hooks for customization:
```typescript
protected applySearch() { /* override */ }
protected async validateData() { /* override */ }
```

### 4. **Model Pattern**
Separates data access from business logic:
```typescript
Model: Database queries
Controller: Business logic & validation
```

### 5. **Middleware Chain**
Processes request through middleware stack:
```
Request → CORS → JSON Parser → Router → Error Handler → Response
```

## Performance Optimizations

### Database
- Connection pooling (min: 2, max: 10)
- Indexes on frequently searched columns
- Pagination to limit results

### API
- Pagination default limit: 10, max: 100
- Search field limits
- Efficient query building with Knex

### Error Handling
- Graceful error responses
- Detailed logs in development
- Minimal error details in production

## Scalability Features

1. **Modular Structure** - Easy to add new modules
2. **Reusable Controllers** - Generic CRUD class
3. **Type Safe** - TypeScript throughout
4. **Validated Inputs** - Prevents invalid data
5. **Error Handling** - Consistent error format
6. **Connection Pooling** - Efficient DB usage
7. **Async Operations** - Non-blocking I/O
8. **Stateless Design** - Ready for horizontal scaling

## Testing Strategy

### Unit Tests
- Test individual model methods
- Test controller validation
- Test utility functions

### Integration Tests
- Test full request/response flow
- Test database operations
- Test error handling

### End-to-End Tests
- Test API endpoints
- Test pagination
- Test error responses

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and migrated
- [ ] All dependencies installed
- [ ] TypeScript compiles without errors
- [ ] API tested locally
- [ ] Error handling verified
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Production env vars set
- [ ] Logging configured
- [ ] API documentation prepared

## Common Tasks

### Add New Field to User
1. Update `User` interface in `models/User.ts`
2. Update SQL table schema in documentation
3. Update validation in controller

### Create New Module
1. Create model in `models/`
2. Create controller in `controllers/`
3. Create routes in `routes/`
4. Register in `server/index.ts`
5. Document in API_DOCUMENTATION.md

### Add Custom Validation
1. Override `validateData()` in controller
2. Throw `APIError` for validation failures
3. Test with invalid data

### Change Database Connection
1. Update `server/config/database.ts`
2. Update `.env` variables
3. Restart server

## Related Documentation

- **API Docs**: `API_DOCUMENTATION.md` - Complete endpoint reference
- **Database**: `DATABASE.md` - SQL schemas and examples
- **Getting Started**: `GETTING_STARTED.md` - Quick setup guide
- **Express**: https://expressjs.com/
- **Knex.js**: https://knexjs.org/
- **TypeScript**: https://www.typescriptlang.org/
