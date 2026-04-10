import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { IProcurementRepository } from "../application/ports/procurement.repository.port";

@Injectable()
export class PrismaProcurementRepository implements IProcurementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchaseRequest(prNumber: string, requestedBy: string, items: any[]): Promise<any> {
    // (Giản lược: Trong thực tế bạn có bảng PR Items)
    return this.prisma.purchaseRequest.create({
      data: { prNumber, status: "DRAFT", requestedBy }
    });
  }

  async createPurchaseOrder(poNumber: string, dto: any, createdBy: string): Promise<any> {
    return this.prisma.purchaseOrder.create({
      data: {
        poNumber,
        prId: dto.prId,
        supplierId: dto.supplierId,
        status: "APPROVED",
        createdBy,
        items: {
          create: dto.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost || "0"
          }))
        }
      }
    });
  }

  async getPurchaseOrderById(poId: string): Promise<any> {
    return this.prisma.purchaseOrder.findUnique({ where: { id: poId }, include: { items: true } });
  }

  async executeReceiveGoodsTransaction(grnNumber: string, dto: any, createdBy: string): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Tạo GRN
      const grn = await tx.goodsReceiptNote.create({
        data: {
          grnNumber,
          poId: dto.poId,
          warehouseId: dto.warehouseId,
          status: "COMPLETED",
          createdBy
        }
      });

      // 2. Cập nhật PO Items & Kiểm tra trạng thái PO
      let allItemsFullyReceived = true;
      for (const item of dto.items) {
        const poItem = await tx.purchaseOrderItem.findFirst({
          where: { purchaseOrderId: dto.poId, productId: item.productId }
        });

        if (poItem) {
          // Cộng dồn số lượng nhận mới vào số lượng đã nhận trước đó
          const newReceivedTotal = Number(poItem.receivedQuantity) + Number(item.receivedQuantity);
          
          await tx.purchaseOrderItem.update({
            where: { id: poItem.id },
            data: { receivedQuantity: newReceivedTotal.toString() }
          });

          if (newReceivedTotal < Number(poItem.quantity)) {
            allItemsFullyReceived = false;
          }
        }
      }

      // 3. Cập nhật trạng thái PO dựa trên kết quả nhận hàng
      await tx.purchaseOrder.update({
        where: { id: dto.poId },
        data: { status: allItemsFullyReceived ? "COMPLETED" : "PARTIAL" }
      });

      // 4. Ghi nhận sự kiện vào Outbox để Module Inventory cập nhật tồn kho
      await tx.outboxEvent.create({
        data: {
          aggregateType: "Procurement",
          aggregateId: grn.id,
          eventType: "procurement.goods.received",
          payload: {
            grnId: grn.id,
            warehouseId: dto.warehouseId,
            items: dto.items
          }
        }
      });

      return grn;
    });
  }
}