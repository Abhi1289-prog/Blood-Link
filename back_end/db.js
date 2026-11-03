const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI || process.env.Mongo_URI;

const connectDB = async () => {
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  const CONNECTION_TIMEOUT = 2 * 60 * 1000;

  const timeout = setTimeout(() => {
    console.error("❌ MongoDB connection timed out (2 minutes). Exiting...");
    process.exit(1);
  }, CONNECTION_TIMEOUT);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
      socketTimeoutMS: 30000,
      family: 4,
    });

    clearTimeout(timeout);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    clearTimeout(timeout);

    console.error("❌ MongoDB Connection Error:", error.message);

    const maskedUri = mongoUri.replace(
      /:[^@]+@/,
      ":***@"
    );

    console.error("❌ Connection Details:", {
      uri: maskedUri,
      timeout: CONNECTION_TIMEOUT
    });

    process.exit(1);
  }
};

connectDB();

module.exports = connectDB;

