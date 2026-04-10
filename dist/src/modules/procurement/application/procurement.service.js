"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcurementService = void 0;
const crypto_1 = require("crypto");
/* * TẦNG APPLICATION (USE CASES)
 * Tuyệt đối KHÔNG import @nestjs/common, Prisma, hay OutboxPublisher.
 */
class ProcurementService {
    repo;
    eventPublisher;
    constructor(repo, eventPublisher) {
        this.repo = repo;
        this.eventPublisher = eventPublisher;
    }
    async createPurchaseRequest(dto) {
        const pr = {
            id: (0, crypto_1.randomUUID)(),
            prNumber: `PR-${Date.now()}`,
            status: "DRAFT",
            requestedBy: dto.requestedBy ?? null
        };
        const savedPr = await this.repo.savePurchaseRequest(pr);
        await this.eventPublisher.publish({
            aggregateType: "PurchaseRequest",
            aggregateId: savedPr.id,
            eventType: "procurement.purchase-request.created",
            payload: savedPr
        });
        return savedPr;
    }
    async createPurchaseOrder(dto) {
        const po = {
            id: (0, crypto_1.randomUUID)(),
            poNumber: `PO-${Date.now()}`,
            prId: dto.prId ?? null,
            supplierId: dto.supplierId ?? null,
            status: "DRAFT",
            totalAmount: dto.totalAmount ?? "0",
            createdBy: dto.createdBy ?? null,
            items: (dto.items ?? []).map((it) => ({
                productId: it.productId,
                quantity: it.quantity,
                unitCost: it.unitCost
            }))
        };
        return this.repo.savePurchaseOrder(po);
    }
    async receiveGoods(dto) {
        const grn = {
            id: (0, crypto_1.randomUUID)(),
            grnNumber: `GRN-${Date.now()}`,
            poId: dto.poId ?? null,
            warehouseId: dto.warehouseId ?? null,
            status: "RECEIVED",
            createdBy: dto.createdBy ?? null
        };
        return this.repo.saveGoodsReceiptNote(grn);
    }
}
exports.ProcurementService = ProcurementService;
