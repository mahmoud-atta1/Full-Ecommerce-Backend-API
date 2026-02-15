// @desc    Global error handling middleware
const globalError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    status: status,
    message: err.message || "Something went wrong",
  });
};

module.exports = globalError;
