import dotenv from "dotenv";


// Load environment variables first
dotenv.config();

import { app } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

// Detect Vercel environment
const isVercel = process.env.VERCEL === "1";

// Function to start server locally
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    console.log("✅ MongoDB Connected");

    // IMPORTANT:
    // Do NOT call app.listen() on Vercel
    if (!isVercel) {
      app.listen(PORT, () => {
        console.log(`\n🚀 Server is running on port ${PORT}`);
        console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(
          `   Health check: http://localhost:${PORT}/api/v1/health\n`,
        );
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  console.error("🔥 UNHANDLED REJECTION:", reason);

  if (!isVercel) {
    process.exit(1);
  }
});

// Export app for Vercel serverless
export default app;
