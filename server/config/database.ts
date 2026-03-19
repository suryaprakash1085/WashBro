import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

/**
 * Database configuration using Knex.js
 * Supports MySQL with connection pooling
 */
export const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "fusion_db",
    port: parseInt(process.env.DB_PORT || "3306"),
  },
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 30000,
  },
  acquireConnectionTimeout: 3000,
});

/**
 * Test database connection
 */
export async function connectDB(): Promise<void> {
  try {
    await db.raw("SELECT 1");
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error(
      "❌ Database Connection Failed:",
      error instanceof Error ? error.message : error
    );
    // Don't exit process, allow graceful degradation
  }
}

export default db;
