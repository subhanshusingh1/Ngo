// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Set default status code to 500 if not already set
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    // Send response with the error message
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Something went wrong',
        error: {
            code: statusCode,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Show stack trace only in development
        },
    });

    // Log the error details for debugging (only in development mode)
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack); // This will log the stack trace
    }
};

// middleware/notFound.js
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404); // Set 404 status for Not Found error
    next(error); // Pass the error to the errorHandler middleware
};


export {
    errorHandler,
    notFound
}
