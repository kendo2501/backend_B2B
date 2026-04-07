import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { OutboxPublisher } from "@shared/infrastructure/outbox/outbox.publisher";
import { randomUUID } from "crypto";

@Injectable()
export class ProcurementService {
  constructor(private readonly prisma: PrismaService, private readonly outbox: OutboxPublisher) {}

  async createPurchaseRequest(dto: any) {
    const pr = await this.prisma.purchaseRequest.create({
      data: {
        id: randomUUID(),
        prNumber: `PR-${Date.now()}`,
        status: "DRAFT",
        requestedBy: dto.requestedBy ?? null
      }
    });
    await this.outbox.queue({
      aggregateType: "PurchaseRequest",
      aggregateId: pr.id,
      eventType: "procurement.purchase-request.created",
      payload: pr
    });
    return pr;
  }

  async createPurchaseOrder(dto: any) {
    const po = await this.prisma.purchaseOrder.create({
      data: {
        id: randomUUID(),
        poNumber: `PO-${Date.now()}`,
        prId: dto.prId ?? null,
        supplierId: dto.supplierId ?? null,
        status: "DRAFT",
        totalAmount: dto.totalAmount ?? "0",
        createdBy: dto.createdBy ?? null,
        items: {
          create: (dto.items ?? []).map((it: any) => ({
            productId: it.productId,
            quantity: it.quantity,
            unitCost: it.unitCost
          }))
        }
      },
      include: { items: true }
    });
    return po;
  }

  async receiveGoods(dto: any) {
    const grn = await this.prisma.goodsReceiptNote.create({
      data: {
        id: randomUUID(),
        grnNumber: `GRN-${Date.now()}`,
        poId: dto.poId ?? null,
        warehouseId: dto.warehouseId ?? null,
        status: "RECEIVED",
        createdBy: dto.createdBy ?? null
      }
    });
    return grn;
  }
}
