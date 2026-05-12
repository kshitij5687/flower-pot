import mongoose from "mongoose";


// ──────────────────────────────────────────────────────────────
//  connectDB — Establishes the MongoDB connection via Mongoose.
//
//  Called once in server.ts before the Express server starts.
//  If the connection fails, the process exits with code 1
//  so the hosting platform can restart the container.
// ──────────────────────────────────────────────────────────────

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  try {
    const connectionInstance = await mongoose.connect(uri);

    console.log(
      `\n☘️  MongoDB connected! DB Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error);
    throw error;
  }
};

export { connectDB };
