const mongoose = require("mongoose");

const connectDB = async () => {
  // Validate Mongo_URI exists
  if (!process.env.Mongo_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  const CONNECTION_TIMEOUT = 2 * 60 * 1000; // 2 minutes (120000 ms)

  const timeout = setTimeout(() => {
    console.error("❌ MongoDB connection timed out (2 minutes). Exiting...");
    process.exit(1);
  }, CONNECTION_TIMEOUT);

  try {
    await mongoose.connect(process.env.Mongo_URI, {
      serverSelectionTimeoutMS: 2 * 60 * 1000, // MongoDB internal timeout
    });

    clearTimeout(timeout);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    clearTimeout(timeout);
    console.error("❌ MongoDB Connection Error:", error.message);
    // Hide password in URI for security
    const maskedUri = process.env.Mongo_URI?.replace(/:[^@]+@/, ":***@") || "undefined";
    console.error("❌ Connection Details:", {
      uri: maskedUri,
      timeout: CONNECTION_TIMEOUT
    });
    process.exit(1);
  }
};

// Auto-connect when this module is loaded
connectDB();

module.exports = connectDB;

