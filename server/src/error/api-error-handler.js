const ApiError = require('./ApiError');

function apiErrorHandler(err, req, res, next) {
    // can be slow in production bc synchronous
    console.error(err);

    if(err instanceof ApiError) { // expected errors
        res.status(err.code).json(err.message);
        return; // return before running below code
    }

    res.status(500).json('something went wrong!'); // some unexpected error we do not want to expose.
}

module.exports = apiErrorHandler;