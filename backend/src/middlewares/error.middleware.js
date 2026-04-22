const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'A record with that value already exists';
    }
    if (err.name === 'SequelizeValidationError') {
        statusCode = 422;
        message = err.errors.map(e => e.message).join(', ');
    }
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (process.env.NODE_ENV !== 'production') {
        console.error(`[${new Date().toISOString()}] ${statusCode} ${message}`);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;