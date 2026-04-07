import { StockLedgerEntity } from "../../domain/stock-ledger.entity";

export interface InventoryRepositoryPort {
  getInventory(productId: string, warehouseId: string): Promise<{ availableQuantity: string; reservedQuantity: string } | null>;
  upsertInventory(productId: string, warehouseId: string, deltaAvailable: string, deltaReserved: string): Promise<void>;
  appendLedger(entry: StockLedgerEntity): Promise<StockLedgerEntity>;
}
