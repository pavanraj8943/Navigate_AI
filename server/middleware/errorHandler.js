// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // TODO: Implement error handling
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;