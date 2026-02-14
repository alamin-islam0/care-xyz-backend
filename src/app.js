import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);
app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.status(200).json({ 
    message: "Welcome to Care.xyz API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      services: "/api/services",
      bookings: "/api/bookings"
    }
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Care.xyz API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

export default app;
