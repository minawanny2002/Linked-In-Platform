const notFoundErrorHandler = (req, res, next) =>
  next(new Error("API Not Found", { cause: 404 })
);

export default notFoundErrorHandler
