import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { PricingEngine } from "../domain/pricing/pricing.engine";
import { randomUUID } from "crypto";
import { OutboxPublisher } from "@shared/infrastructure/outbox/outbox.publisher";

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricing: PricingEngine,
    private readonly outbox: OutboxPublisher
  ) {}

  async createQuote(dto: any) {
    const customer = await this.prisma.businessPartner.findUnique({ where: { id: dto.customerId } });
    if (!customer) throw new Error("Customer not found");

    let totalAmount = 0;
    let discountAmount = 0;
    let taxAmount = 0;
    const items: any[] = [];

    for (const line of dto.items ?? []) {
      const product = await this.prisma.product.findUnique({ where: { id: line.productId } });
      if (!product) throw new Error("Product not found");
      const result = this.pricing.quote({
        customerTier: customer.tier ?? "DEFAULT",
        listPrice: String(product.baseUnit),
        quantity: String(line.quantity),
        contractPrice: line.contractPrice ?? null
      });
      totalAmount += Number(result.total);
      discountAmount += Number(result.discountAmount);
      taxAmount += Number(result.taxAmount);

      items.push({
        productId: product.id,
        quantity: line.quantity,
        unitPrice: result.unitPrice,
        totalPrice: result.subtotal
      });
    }

    const order = await this.prisma.order.create({
      data: {
        id: randomUUID(),
        orderNumber: `SO-${Date.now()}`,
        customerId: customer.id,
        status: "QUOTED",
        totalAmount: totalAmount.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        finalAmount: (totalAmount + taxAmount).toFixed(2),
        createdBy: dto.createdBy ?? null,
        items: { create: items }
      },
      include: { items: true }
    });

    await this.outbox.queue({
      aggregateType: "Order",
      aggregateId: order.id,
      eventType: "sales.order.quoted",
      payload: { orderId: order.id, orderNumber: order.orderNumber }
    });

    return order;
  }

  async confirmOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });
    if (!order) throw new Error("Order not found");
    if (order.status !== "QUOTED" && order.status !== "PENDING_APPROVAL") {
      throw new ConflictException("Order cannot be confirmed");
    }
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED" }
    });
    await this.outbox.queue({
      aggregateType: "Order",
      aggregateId: order.id,
      eventType: "sales.order.confirmed",
      payload: { orderId: order.id }
    });
    return updated;
  }

  async createShipment(dto: any) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId }, include: { items: true } });
    if (!order) throw new Error("Order not found");
    const shipment = await this.prisma.shipment.create({
      data: {
        id: randomUUID(),
        orderId: order.id,
        shipmentNumber: `SH-${Date.now()}`,
        status: "DRAFT",
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
        items: {
          create: (dto.items ?? []).map((it: any) => ({
            orderItemId: it.orderItemId,
            deliveredQuantity: it.deliveredQuantity
          }))
        }
      },
      include: { items: true }
    });
    return shipment;
  }
}
