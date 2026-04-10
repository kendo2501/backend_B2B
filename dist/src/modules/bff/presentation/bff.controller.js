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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BffController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("@shared/infrastructure/prisma/prisma.service");
let BffController = class BffController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async dashboard() {
        const [productCount, orderCount, debtAgg] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.order.count(),
            this.prisma.debtLedger.aggregate({ _sum: { amount: true } })
        ]);
        return {
            productCount,
            orderCount,
            totalDebt: debtAgg._sum.amount ?? "0"
        };
    }
};
exports.BffController = BffController;
__decorate([
    (0, common_1.Get)("dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BffController.prototype, "dashboard", null);
exports.BffController = BffController = __decorate([
    (0, common_1.Controller)("bff"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BffController);
