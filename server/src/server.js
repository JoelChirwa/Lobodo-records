import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

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
  res.send("Lobodo API is working");
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
