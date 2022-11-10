const createError = require("http-errors");

//404 not found handler
function notFoundHandler(req, res, next) {
    next(createError(404, "Not Found!"));
}

//default error handler
function errorHandler(err, req, res, next) {
    res.json({
        success: false,
        message: "Server Error",
    });
}

module.exports = {
    notFoundHandler,
    errorHandler,
};
