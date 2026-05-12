import mongoose from "mongoose";

// ──────────────────────────────────────────────────────────────
//  connectDB — Establishes the MongoDB connection via Mongoose.
//
//  Called once in server.ts before the Express server starts.
//  If the connection fails, the process exits with code 1
//  so the hosting platform can restart the container.
// ──────────────────────────────────────────────────────────────

const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI as string
    );

    console.log(
      `\n☘️  MongoDB connected! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error);
    process.exit(1);
  }
};

export { connectDB };
