import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/database.js";

// Load environment variables
dotenv.config();

const app = express();

// Database connection (non-blocking for Vercel)
connectDB().catch((err) => console.error("Database connection failed:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/tracks', require('./routes/tracks'));
// app.use('/api/artists', require('./routes/artists'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/studio', require('./routes/studio'));

app.get("/", (req, res) => {
  res.json({
    title: "Lobodo Records API",
    message: "Lobodo Records API is working",
    status: "online",
    version: "1.0.0",
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Export app for Vercel serverless function
export default app;

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
