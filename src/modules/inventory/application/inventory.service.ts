import { Injectable, ConflictException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { InventoryRepositoryPort } from "./ports/inventory.repository.port";
import { StockLedgerEntity } from "../domain/stock-ledger.entity";
import { OutboxPublisher } from "@shared/infrastructure/outbox/outbox.publisher";

@Injectable()
export class InventoryService {
  constructor(
    private readonly repo: InventoryRepositoryPort,
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxPublisher
  ) {}

  async reserve(dto: { productId: string; warehouseId: string; quantity: string; referenceId: string }) {
    try {
      // Đẩy toàn bộ logic cập nhật vào trong Transaction. 
      // Hàm upsertInventory ở tầng Repo sẽ chịu trách nhiệm bắn lỗi nếu số lượng bị âm (qua DB Constraint hoặc Lock).
      await this.prisma.$transaction(async (tx) => {
        await this.repo.upsertInventory(dto.productId, dto.warehouseId, String(-Number(dto.quantity)), dto.quantity);
        
        const ledger = new StockLedgerEntity(
          randomUUID(), dto.productId, dto.warehouseId, "HOLD", dto.quantity, null, dto.referenceId, null
        );
        await this.repo.appendLedger(ledger);
        
        await this.outbox.queueTx(tx, {
          aggregateType: "Inventory",
          aggregateId: `${dto.productId}:${dto.warehouseId}`,
          eventType: "inventory.reserved",
          payload: dto
        });
      });

      return { success: true };
    } catch (error) {
      throw new ConflictException("Insufficient inventory or race condition detected");
    }
  }

  async deduct(dto: { productId: string; warehouseId: string; quantity: string; referenceId: string }) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await this.repo.upsertInventory(dto.productId, dto.warehouseId, String(-Number(dto.quantity)), "0");
        
        const ledger = new StockLedgerEntity(
          randomUUID(), dto.productId, dto.warehouseId, "OUT", dto.quantity, null, dto.referenceId, null
        );
        await this.repo.appendLedger(ledger);
        
        await this.outbox.queueTx(tx, {
          aggregateType: "Inventory",
          aggregateId: `${dto.productId}:${dto.warehouseId}`,
          eventType: "inventory.deducted",
          payload: dto
        });
      });

      return { success: true };
    } catch (error) {
      throw new ConflictException("Stock would go negative or race condition detected");
    }
  }

  async getAvailable(productId: string, warehouseId: string) {
    return this.repo.getInventory(productId, warehouseId);
  }
}