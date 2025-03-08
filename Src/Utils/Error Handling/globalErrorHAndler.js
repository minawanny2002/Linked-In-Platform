const globalErrorHandler = (error, req, res, next) => {
    let status;
    if (typeof (error.cause) == "number") {
        status = error.cause;
    } else {
      status = 500;
    }
    return res.status(status).json({ success: false, message: error.message, stack: error.stack });
}

  export default globalErrorHandler;