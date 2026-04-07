import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { InventoryRepositoryPort } from "../application/ports/inventory.repository.port";
import { StockLedgerEntity } from "../domain/stock-ledger.entity";

@Injectable()
export class PrismaInventoryRepository implements InventoryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getInventory(productId: string, warehouseId: string) {
    return this.prisma.inventory.findUnique({
      where: { productId_warehouseId: { productId, warehouseId } }
    });
  }

  async upsertInventory(productId: string, warehouseId: string, deltaAvailable: string, deltaReserved: string): Promise<void> {
    await this.prisma.inventory.upsert({
      where: { productId_warehouseId: { productId, warehouseId } },
      create: {
        productId,
        warehouseId,
        availableQuantity: deltaAvailable,
        reservedQuantity: deltaReserved
      },
      update: {
        availableQuantity: { increment: deltaAvailable as any },
        reservedQuantity: { increment: deltaReserved as any }
      } as any
    });
  }

  async appendLedger(entry: StockLedgerEntity): Promise<StockLedgerEntity> {
    await this.prisma.stockLedger.create({
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
    return entry;
  }
}
