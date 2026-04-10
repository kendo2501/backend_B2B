"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const correlationId = ctx.getRequest()?.headers?.["x-correlation-id"] ?? null;
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const resp = exception.getResponse();
            return res.status(status).json({
                success: false,
                message: typeof resp === "string" ? resp : resp.message ?? exception.message,
                errorCode: resp.errorCode ?? "HTTP_ERROR",
                correlationId
            });
        }
        return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            errorCode: "INTERNAL_SERVER_ERROR",
            correlationId
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
