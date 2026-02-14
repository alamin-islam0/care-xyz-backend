import app from "./app.js";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";

// Connect to database once
let isConnected = false;

async function ensureDbConnection() {
  if (!isConnected) {
    await connectDb();
    isConnected = true;
  }
}

// For Vercel serverless
export default async function handler(req, res) {
  await ensureDbConnection();
  return app(req, res);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  async function startServer() {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  }

  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
