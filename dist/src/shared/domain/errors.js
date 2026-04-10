"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.NotFoundError = exports.ConflictError = exports.ValidationError = exports.DomainError = void 0;
class DomainError extends Error {
    code;
    constructor(message, code = "DOMAIN_ERROR") {
        super(message);
        this.code = code;
    }
}
exports.DomainError = DomainError;
class ValidationError extends DomainError {
    constructor(message, code = "VALIDATION_ERROR") {
        super(message, code);
    }
}
exports.ValidationError = ValidationError;
class ConflictError extends DomainError {
    constructor(message, code = "CONFLICT") {
        super(message, code);
    }
}
exports.ConflictError = ConflictError;
class NotFoundError extends DomainError {
    constructor(message, code = "NOT_FOUND") {
        super(message, code);
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends DomainError {
    constructor(message, code = "FORBIDDEN") {
        super(message, code);
    }
}
exports.ForbiddenError = ForbiddenError;
