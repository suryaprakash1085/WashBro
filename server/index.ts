import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, db } from "./config/database.js";
import { runMigrations } from "./utils/migrations.js";
import { errorHandler } from "./middleware/errorHandler.js";
import {
  rateLimitMiddleware,
  loggingMiddleware,
  validateRequestBody,
  corsOptions
} from "./middleware/auth.js";


dotenv.config();

export async function createServer() {
  const app = express();

  // ================= MIDDLEWARE =================
  app.use(cors(corsOptions));
  app.use(loggingMiddleware);
  app.use(rateLimitMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(validateRequestBody);

  // ================= DATABASE =================
  // Connect to database asynchronously (non-blocking)
  connectDB().catch((error) => {
    console.warn("⚠️ Database connection not available:", error instanceof Error ? error.message : error);
  });

  // Initialize database tables via migrations
  try {
    await runMigrations(db);
  } catch (error) {
    console.warn("⚠️ Migrations error:", error instanceof Error ? error.message : error);
  }



  // ================= API ROUTES =================
  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ success: true, message: "Server is healthy" });
  });

  // Import routes
  const { authRouter } = await import("./routes/auth.js");
  const { usersRouter } = await import("./routes/users.js");
  const { servicesRouter } = await import("./routes/services.js");
  const { ordersRouter } = await import("./routes/orders.js");
  const { messagesRouter } = await import("./routes/messages.js");
  const { settingsRouter } = await import("./routes/settings.js");
  const { homepageRouter } = await import("./routes/homepage.js");
  const { aboutRouter } = await import("./routes/about.js");

  // Register routes
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/services", servicesRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/settings", settingsRouter);
  app.use("/api/homepage", homepageRouter);
  app.use("/api/about", aboutRouter);

  // 404 handler for unknown API routes
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/health") {
      return res.status(404).json({
        success: false,
        error: {
          message: "Endpoint not found",
          path: req.path,
          method: req.method,
        },
      });
    }

    next();
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app; // ✅ important
}


const PORT = process.env.PORT || 9005;

async function startStandalone() {
  const app = await createServer();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   - Health Check: GET /health`);
    console.log(`   - Users API: GET /api/users`);
  });
}

// `import.meta.main` is true when the file is the entry point (ESM)
if (import.meta.main) {
  startStandalone();
}
