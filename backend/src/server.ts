import dotenv from "dotenv";


dotenv.config();

import { app } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const isVercel = process.env.VERCEL === "1";

// Cache DB connection
let isConnected = false;

const startServer = async () => {
  try {
    // Prevent reconnecting every invocation
    if (!isConnected) {
      await connectDB();
      isConnected = true;

      console.log("✅ MongoDB Connected");
    }

    // Local development only
    if (!isVercel) {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("❌ Startup error:", error);

    // NEVER process.exit on Vercel
    if (!isVercel) {
      process.exit(1);
    }
  }
};

startServer();

// Handle unhandled rejections safely
process.on("unhandledRejection", (reason) => {
  console.error("🔥 UNHANDLED REJECTION:", reason);
});

// Export for Vercel
export default app;
