"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("../application/finance.service");
let FinanceController = class FinanceController {
    service;
    constructor(service) {
        this.service = service;
    }
    recordDebt(body) {
        return this.service.recordDebt(body);
    }
    checkCredit(body) {
        return this.service.checkCreditLimit(body.partnerId, body.orderValue);
    }
    allocate(body) {
        return this.service.allocatePayment(body);
    }
    aging(partnerId) {
        return this.service.agingReport(partnerId);
    }
    close(body) {
        return this.service.closePeriod(body.periodName, body.closedBy);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Post)("debt"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "recordDebt", null);
__decorate([
    (0, common_1.Post)("credit-limit/check"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "checkCredit", null);
__decorate([
    (0, common_1.Post)("payments/allocate"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "allocate", null);
__decorate([
    (0, common_1.Get)("aging"),
    __param(0, (0, common_1.Query)("partnerId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "aging", null);
__decorate([
    (0, common_1.Post)("periods/close"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "close", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)("finance"),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
