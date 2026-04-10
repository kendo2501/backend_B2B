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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("../application/sales.service");
let SalesController = class SalesController {
    service;
    constructor(service) {
        this.service = service;
    }
    createQuote(body) {
        return this.service.createQuote(body);
    }
    confirm(body) {
        return this.service.confirmOrder(body.orderId);
    }
    createShipment(body) {
        return this.service.createShipment(body);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)("quotes"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "createQuote", null);
__decorate([
    (0, common_1.Post)("orders/:id/confirm"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)("shipments"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "createShipment", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)("sales"),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
