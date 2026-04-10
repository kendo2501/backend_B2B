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
exports.PrismaInventoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("@shared/infrastructure/prisma/prisma.service");
const outbox_publisher_1 = require("@shared/infrastructure/outbox/outbox.publisher");
/**
 * OUTBOUND ADAPTER
 * Nơi duy nhất biết về Database và cách Gom nhóm Giao dịch (Transaction)
 */
let PrismaInventoryRepository = class PrismaInventoryRepository {
    prisma;
    outbox;
    constructor(prisma, outbox) {
        this.prisma = prisma;
        this.outbox = outbox;
    }
    async getInventory(productId, warehouseId) {
        return this.prisma.inventory.findUnique({
            where: { productId_warehouseId: { productId, warehouseId } }
        });
    }
    async executeReserveTransaction(productId, warehouseId, deltaAvailable, deltaReserved, ledger, eventPayload) {
        // Bao bọc toàn bộ bằng DB Transaction của Prisma
        await this.prisma.$transaction(async (tx) => {
            await this.upsertInventoryTx(tx, productId, warehouseId, deltaAvailable, deltaReserved);
            await this.appendLedgerTx(tx, ledger);
            await this.outbox.queueTx(tx, eventPayload);
        });
    }
    async executeDeductTransaction(productId, warehouseId, deltaAvailable, deltaReserved, ledger, eventPayload) {
        await this.prisma.$transaction(async (tx) => {
            await this.upsertInventoryTx(tx, productId, warehouseId, deltaAvailable, deltaReserved);
            await this.appendLedgerTx(tx, ledger);
            await this.outbox.queueTx(tx, eventPayload);
        });
    }
    // Cập nhật Inventory an toàn đa luồng (Optimistic Update) nhờ increment của Prisma
    async upsertInventoryTx(tx, productId, warehouseId, deltaAvailable, deltaReserved) {
        await tx.inventory.upsert({
            where: { productId_warehouseId: { productId, warehouseId } },
            create: {
                productId,
                warehouseId,
                availableQuantity: deltaAvailable,
                reservedQuantity: deltaReserved
            },
            update: {
                availableQuantity: { increment: deltaAvailable },
                reservedQuantity: { increment: deltaReserved }
            }
        });
    }
    // Ghi Log Sổ Cái Bất biến (Immutable Ledger)
    async appendLedgerTx(tx, entry) {
        await tx.stockLedger.create({
            data: {
                id: entry.id ?? undefined,
                productId: entry.productId,
                warehouseId: entry.warehouseId,
                transactionType: entry.transactionType,
                quantity: entry.quantity,
                movingAverageCost: entry.movingAverageCost ?? null,
                referenceId: entry.referenceId ?? null,
                createdBy: entry.createdBy ?? null
            }
        });
    }
};
exports.PrismaInventoryRepository = PrismaInventoryRepository;
exports.PrismaInventoryRepository = PrismaInventoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outbox_publisher_1.OutboxPublisher])
], PrismaInventoryRepository);
