# Getting Started with the Backend

## Quick Setup (5 minutes)

### 1. Environment Configuration

Create/update your `.env` file:

```env
# Database
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=fusion_db
DB_PORT=3306

# Server
PORT=9005
NODE_ENV=development
```

### 2. Create MySQL Database

```sql
CREATE DATABASE fusion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Start Development Server

```bash
pnpm dev
```

The server will automatically create the users table on startup.

### 4. Test the API

```bash
# Health check
curl http://localhost:9005/health

# Get all users
curl http://localhost:9005/api/users

# Create a user
curl -X POST http://localhost:9005/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "status": "active"
  }'
```

---

## Project Structure

```
server/
├── config/
│   └── database.ts              # MySQL connection & pool setup
├── middleware/
│   └── errorHandler.ts          # Global error handling & async wrapper
├── models/
│   └── User.ts                  # User database model & queries
├── controllers/
│   └── userController.ts        # Business logic for users
├── routes/
│   └── users.ts                 # User API endpoints
├── utils/
│   └── crudController.ts        # Generic CRUD base class
├── index.ts                     # Main Express server
├── DATABASE.md                  # SQL table schemas
├── API_DOCUMENTATION.md         # Complete API reference
└── GETTING_STARTED.md           # This file
```

---

## Key Features

✅ **MVC Architecture** - Models, Controllers, Routes organized separately  
✅ **Reusable CRUD Controller** - Generic base class for common operations  
✅ **Error Handling** - Centralized error middleware with consistent responses  
✅ **Async/Await** - All database operations use modern async patterns  
✅ **Pagination & Search** - Built-in filtering and pagination  
✅ **Validation** - Data validation at controller level  
✅ **Type Safe** - Full TypeScript support  
✅ **Production Ready** - Connection pooling, error handling, logging  

---

## API Endpoints

### Users API (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Get all users (paginated) |
| `GET` | `/stats` | Get user statistics |
| `GET` | `/search` | Search users |
| `GET` | `/status/:status` | Get users by status |
| `GET` | `/:id` | Get single user |
| `POST` | `/` | Create user |
| `PUT` | `/:id` | Update user |
| `DELETE` | `/:id` | Delete user |
| `PATCH` | `/bulk/status` | Bulk update status |

---

## Creating New Modules (Products Example)

### Step 1: Create Model

**server/models/Product.ts:**
```typescript
import { Knex } from "knex";
import db from "../config/database.js";

export interface Product {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  created_at?: Date;
}

export class ProductModel {
  static async createTable(): Promise<void> {
    const exists = await db.schema.hasTable("products");
    if (exists) return;

    await db.schema.createTable("products", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.decimal("price", 10, 2).notNullable();
      table.integer("quantity").defaultTo(0);
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
    });
  }

  // Add query methods like in UserModel
}
```

### Step 2: Create Controller

**server/controllers/productController.ts:**
```typescript
import { CRUDController } from "../utils/crudController.js";
import { Product } from "../models/Product.js";
import db from "../config/database.js";

export class ProductController extends CRUDController<Product> {
  constructor() {
    super("products", db, "id");
  }

  protected applySearch(query: any, searchTerm: string) {
    return query.where("name", "like", `%${searchTerm}%`);
  }

  protected async validateData(data: Product): Promise<void> {
    if (!data.name) throw new Error("Name is required");
    if (!data.price || data.price <= 0) throw new Error("Valid price is required");
  }
}

export const productController = new ProductController();
```

### Step 3: Create Routes

**server/routes/products.ts:**
```typescript
import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

router.get("/", asyncHandler((req, res) => productController.getAll(req, res)));
router.get("/:id", asyncHandler((req, res) => productController.getById(req, res)));
router.post("/", asyncHandler((req, res) => productController.create(req, res)));
router.put("/:id", asyncHandler((req, res) => productController.update(req, res)));
router.delete("/:id", asyncHandler((req, res) => productController.delete(req, res)));

export default router;
```

### Step 4: Register in Server

**server/index.ts:**
```typescript
import productRoutes from "./routes/products.js";
import { ProductModel } from "./models/Product.js";

// In createServer():
await ProductModel.createTable();
app.use("/api/products", productRoutes);
```

Done! Now you have a fully functional Products API.

---

## Common Errors & Solutions

### Database Connection Error
```
❌ Database Connection Failed: connect ECONNREFUSED
```
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

### Email Already Exists (409)
```json
{
  "success": false,
  "error": {
    "message": "Email already exists",
    "statusCode": 409
  }
}
```
- Use unique email address

### Validation Failed (400)
```json
{
  "success": false,
  "error": {
    "message": "Invalid email format",
    "statusCode": 400
  }
}
```
- Check request body format
- Verify required fields
- Use valid email/phone format

---

## Development Tips

1. **Hot Reload**: Changes to server code automatically reload during `pnpm dev`
2. **Type Safety**: Run `pnpm typecheck` to catch TypeScript errors
3. **Database Debugging**: Check `.env` configuration and MySQL logs
4. **Testing**: Use curl or Postman to test endpoints
5. **Pagination**: Always use pagination for large datasets

---

## Deployment

### Build for Production
```bash
pnpm build
pnpm start
```

### Environment Variables
Set production env vars:
```env
NODE_ENV=production
DB_HOST=your_prod_host
DB_USERNAME=prod_user
DB_PASSWORD=prod_password
DB_NAME=prod_database
PORT=3000
```

---

## Useful Resources

- **API Docs**: See `API_DOCUMENTATION.md`
- **Database**: See `DATABASE.md`
- **Express Docs**: https://expressjs.com
- **Knex Docs**: https://knexjs.org
- **MySQL Docs**: https://dev.mysql.com/doc

---

## Next Steps

1. ✅ Setup database and start server
2. ✅ Test users API endpoints
3. ✅ Create new modules as needed
4. ✅ Add authentication (JWT/sessions)
5. ✅ Add input validation (Zod/Joi)
6. ✅ Add logging (Winston/Morgan)
7. ✅ Deploy to production (Netlify/Vercel)

Happy coding! 🚀
