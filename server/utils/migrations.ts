import { Knex } from "knex";

/**
 * Simple migration runner for development
 * In production, use knex migration CLI
 */
export async function runMigrations(db: Knex): Promise<void> {
  try {
    console.log("🔄 Running database migrations...");

    // Create users table
    const hasUsersTable = await db.schema.hasTable("users");
    if (!hasUsersTable) {
      console.log("📝 Creating users table...");
      await db.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name", 255).notNullable();
        table.string("email", 255).unique().notNullable();
        table.string("password", 255).notNullable();
        table.string("phone", 20);
        table.enum("role", ["admin", "customer"]).defaultTo("customer");
        table.text("address");
        table.string("city", 100);
        table.string("zipcode", 20);
        table.boolean("is_active").defaultTo(true);
        table.timestamp("created_at").defaultTo(db.fn.now());
        table.timestamp("updated_at").defaultTo(db.fn.now());
      });
      console.log("✅ Users table created");
    }

    // Create services table
    const hasServicesTable = await db.schema.hasTable("services");
    if (!hasServicesTable) {
      console.log("📝 Creating services table...");
      await db.schema.createTable("services", (table) => {
        table.increments("id").primary();
        table.string("name", 255).notNullable();
        table.text("description");
        table.string("category", 100).notNullable();
        table.decimal("price", 10, 2).notNullable();
        table.integer("duration_minutes").notNullable();
        table.text("image_url");
        table.boolean("is_active").defaultTo(true);
        table.timestamp("created_at").defaultTo(db.fn.now());
        table.timestamp("updated_at").defaultTo(db.fn.now());
      });
      console.log("✅ Services table created");
    }

    // Create orders table
    const hasOrdersTable = await db.schema.hasTable("orders");
    if (!hasOrdersTable) {
      console.log("📝 Creating orders table...");
      await db.schema.createTable("orders", (table) => {
        table.increments("id").primary();
        table.integer("customer_id").unsigned().notNullable();
        table.integer("service_id").unsigned().notNullable();
        table.string("service_name", 255).notNullable();
        table.decimal("price", 10, 2).notNullable();
        table.enum("status", ["pending", "confirmed", "in_progress", "completed", "cancelled"]).defaultTo("pending");
        table.dateTime("scheduled_date").notNullable();
        table.text("notes");
        table.decimal("total_amount", 10, 2).notNullable();
        table.timestamp("created_at").defaultTo(db.fn.now());
        table.timestamp("updated_at").defaultTo(db.fn.now());
        table.foreign("customer_id").references("id").inTable("users").onDelete("CASCADE");
      });
      console.log("✅ Orders table created");
    }

    // Create messages table
    const hasMessagesTable = await db.schema.hasTable("messages");
    if (!hasMessagesTable) {
      console.log("📝 Creating messages table...");
      await db.schema.createTable("messages", (table) => {
        table.increments("id").primary();
        table.string("name", 255).notNullable();
        table.string("email", 255).notNullable();
        table.string("phone", 20);
        table.text("message").notNullable();
        table.enum("status", ["unread", "read", "replied"]).defaultTo("unread");
        table.text("reply_message");
        table.timestamp("replied_at");
        table.timestamp("created_at").defaultTo(db.fn.now());
        table.timestamp("updated_at").defaultTo(db.fn.now());
      });
      console.log("✅ Messages table created");
    }

    console.log("✅ All migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error instanceof Error ? error.message : error);
    throw error;
  }
}
