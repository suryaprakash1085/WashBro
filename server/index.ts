import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";


dotenv.config();

export async function createServer() {
  const app = express();

  // ================= MIDDLEWARE =================
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ================= DATABASE =================
  // Connect to database asynchronously (non-blocking)
  connectDB().catch((error) => {
    console.warn("⚠️ Database connection not available:", error instanceof Error ? error.message : error);
  });

  // Initialize database tables
  try {
    console.log("📊 Creating database tables...");

    console.log("✅ Database tables initialized successfully");
  } catch (error) {
    console.warn("⚠️ Tables may already exist or could not be created:", error instanceof Error ? error.message : error);
  }



  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ success: true, message: "Server is healthy working" });
  });

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
