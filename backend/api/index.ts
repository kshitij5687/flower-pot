import dotenv from "dotenv";


dotenv.config();

import { app } from "../src/app";
import { connectDB } from "../src/config/db";

let dbConnected = false;

const ensureDb = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

export default async function handler(req: any, res: any) {
  await ensureDb();
  return app(req, res);
}
