// middelwares/errorhandel.js

module.exports = (err, req, res, next) => {
  console.error("🔥 Error Middleware:", err);

  // If the error has its own status code use it, otherwise default 500
  const statusCode = err.statusCode || 500;

  // Build a safe response
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  // Include stack only in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
