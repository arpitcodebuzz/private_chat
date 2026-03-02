// src/middlewares/error.middleware.js

const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 ERROR: in server", err);

  const statusCode = err.statusCode || 500;
  const message =
    err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;