"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockLedgerEntity = void 0;
const errors_1 = require("@shared/domain/errors");
class StockLedgerEntity {
    id;
    productId;
    warehouseId;
    transactionType;
    quantity;
    movingAverageCost;
    referenceId;
    createdBy;
    constructor(id, productId, warehouseId, transactionType, quantity, movingAverageCost, referenceId, createdBy) {
        this.id = id;
        this.productId = productId;
        this.warehouseId = warehouseId;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.movingAverageCost = movingAverageCost;
        this.referenceId = referenceId;
        this.createdBy = createdBy;
        if (!productId)
            throw new errors_1.ValidationError("productId is required");
        if (!warehouseId)
            throw new errors_1.ValidationError("warehouseId is required");
    }
}
exports.StockLedgerEntity = StockLedgerEntity;
