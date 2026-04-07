import { Module } from "@nestjs/common";
import { InventoryController } from "./presentation/inventory.controller";
import { InventoryService } from "./application/inventory.service";
import { PrismaInventoryRepository } from "./infrastructure/prisma-inventory.repository";

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, PrismaInventoryRepository],
  exports: [InventoryService, PrismaInventoryRepository]
})
export class InventoryModule {}
