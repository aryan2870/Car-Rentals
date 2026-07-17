const fs = require("fs");
const path = require("path");

// Load environment variables from .env file if it exists
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.trim();
    }
  });
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const bookings = require('./routes/api/bookings');
const newsletter = require('./routes/api/newsletter');
const contact = require('./routes/api/contact');

const app = express();

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/carDB";
  const db = await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });
  isConnected = db.connections[0].readyState === 1;
};

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/api/test-db", async (req, res) => {
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({
      status: "ok",
      connectionState: states[state],
      mongoURI: process.env.MONGODB_URI 
        ? "configured (starts with " + process.env.MONGODB_URI.substring(0, 18) + "...)" 
        : "not configured (using fallback localhost)"
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error",
      message: error.message,
      stack: error.stack,
      mongoURI: process.env.MONGODB_URI 
        ? "configured (starts with " + process.env.MONGODB_URI.substring(0, 18) + "...)" 
        : "not configured (using fallback localhost)"
    });
  }
});

// Middleware to ensure DB connection is ready in serverless environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    return res.status(500).json({ message: "Database connection failed. Please try again." });
  }
});

// Use the cors middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://amazing-cocada-4fdf02.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      const isLocal = url.hostname === "localhost" || 
                      url.hostname === "127.0.0.1" || 
                      /^[0-9.]+$/.test(url.hostname);
                      
      if (isLocal || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    } catch (e) {
      // Invalid URL
    }
    return callback(new Error("Not allowed by CORS policy."));
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

// API endpoints configuration
app.use("/api/users", users);
app.use("/api/bookings", bookings);
app.use("/api/newsletter", newsletter);
app.use("/api/contact", contact);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});


// Default error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};
app.use(errorHandler);

module.exports = app;
