"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error(err);
    res.status(500).json({
        message: err.message || "Internal server error"
    });
}
