import dotenv from "dotenv";

// ──────────────────────────────────────────────────────────────
//  Server Entry Point
//
//  1. Load environment variables from .env
//  2. Connect to MongoDB
//  3. Start the Express server
//  4. Handle unhandled promise rejections gracefully
//
//  This is the file that gets executed:
//    Development: `nodemon --exec ts-node src/server.ts`
//    Production:  `node dist/server.js`
// ──────────────────────────────────────────────────────────────

// Load .env BEFORE importing anything else that uses env vars
dotenv.config();

import { app } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`   Health check: http://localhost:${PORT}/api/v1/health\n`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });

// Handle unhandled promise rejections (e.g. DB disconnects)
process.on("unhandledRejection", (reason: any) => {
  console.error("🔥 UNHANDLED REJECTION:", reason);
  process.exit(1);
});
