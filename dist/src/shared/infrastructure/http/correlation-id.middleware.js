"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationIdMiddleware = void 0;
const crypto_1 = require("crypto");
class CorrelationIdMiddleware {
    use(req, res, next) {
        const incoming = req.headers["x-correlation-id"];
        const id = (Array.isArray(incoming) ? incoming[0] : incoming) || (0, crypto_1.randomUUID)();
        req.headers["x-correlation-id"] = id;
        res.setHeader("x-correlation-id", id);
        next();
    }
}
exports.CorrelationIdMiddleware = CorrelationIdMiddleware;
