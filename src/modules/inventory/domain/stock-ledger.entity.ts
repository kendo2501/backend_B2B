import { ValidationError } from "@shared/domain/errors";

export type LedgerDirection = "IN" | "OUT" | "HOLD" | "RELEASE";

export class StockLedgerEntity {
  constructor(
    public readonly id: string | null,
    public productId: string,
    public warehouseId: string,
    public transactionType: string,
    public quantity: string,
    public movingAverageCost: string | null,
    public referenceId: string | null,
    public createdBy: string | null
  ) {
    if (!productId) throw new ValidationError("productId is required");
    if (!warehouseId) throw new ValidationError("warehouseId is required");
  }
}
