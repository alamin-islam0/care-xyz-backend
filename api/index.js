import app from "../src/app.js";
import { connectDb } from "../src/config/db.js";

// Connect to database once (cached across invocations)
let cachedDb = null;

async function ensureDbConnection() {
  if (cachedDb) {
    return cachedDb;
  }
  
  cachedDb = await connectDb();
  return cachedDb;
}

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    // Ensure database connection
    await ensureDbConnection();
    
    // Let Express handle the request
    app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: error.message 
    });
  }
}

