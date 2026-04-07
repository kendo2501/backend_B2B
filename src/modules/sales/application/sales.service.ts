import { Injectable, ConflictException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PricingEngine } from "../domain/pricing/pricing.engine";
import { OutboxPublisher } from "@shared/infrastructure/outbox/outbox.publisher";
import { Money } from "@shared/domain/money";
import { OrderRepositoryPort } from "./ports/order.repository.port";
import { CustomerRepositoryPort } from "./ports/customer.repository.port";
import { ProductRepositoryPort } from "./ports/product.repository.port";

@Injectable()
export class SalesService {
  constructor(
    private readonly orderRepo: OrderRepositoryPort,
    private readonly customerRepo: CustomerRepositoryPort,
    private readonly productRepo: ProductRepositoryPort,
    private readonly pricing: PricingEngine,
    private readonly outbox: OutboxPublisher
  ) {}

  async createQuote(dto: any) {
    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer) throw new Error("Customer not found");

    // Bắt buộc dùng class Money cho các phép toán tài chính
    let totalAmount = Money.zero();
    let discountAmount = Money.zero();
    let taxAmount = Money.zero();
    const items: any[] = [];

    for (const line of dto.items ?? []) {
      const product = await this.productRepo.findById(line.productId);
      if (!product) throw new Error("Product not found");
      
      const result = this.pricing.quote({
        customerTier: customer.tier ?? "DEFAULT",
        listPrice: String(line.unitPrice || 0), // Lấy giá từ input dto thay vì baseUnit
        quantity: String(line.quantity),
        contractPrice: line.contractPrice ?? null
      });

      totalAmount = totalAmount.add(Money.from(result.total));
      discountAmount = discountAmount.add(Money.from(result.discountAmount));
      taxAmount = taxAmount.add(Money.from(result.taxAmount));

      items.push({
        productId: product.id,
        quantity: line.quantity,
        unitPrice: result.unitPrice,
        totalPrice: result.subtotal
      });
    }

    const order = {
      id: randomUUID(),
      orderNumber: `SO-${Date.now()}`,
      customerId: customer.id,
      status: "QUOTED",
      totalAmount: totalAmount.toString(),
      taxAmount: taxAmount.toString(),
      discountAmount: discountAmount.toString(),
      finalAmount: totalAmount.add(taxAmount).toString(),
      createdBy: dto.createdBy ?? null,
      items: items
    };

    const savedOrder = await this.orderRepo.save(order);

    await this.outbox.queue({
      aggregateType: "Order",
      aggregateId: savedOrder.id,
      eventType: "sales.order.quoted",
      payload: { orderId: savedOrder.id, orderNumber: savedOrder.orderNumber }
    });

    return savedOrder;
  }

  async confirmOrder(orderId: string) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error("Order not found");
    if (order.status !== "QUOTED" && order.status !== "PENDING_APPROVAL") {
      throw new ConflictException("Order cannot be confirmed");
    }
    
    order.status = "CONFIRMED";
    const updated = await this.orderRepo.save(order);

    await this.outbox.queue({
      aggregateType: "Order",
      aggregateId: updated.id,
      eventType: "sales.order.confirmed",
      payload: { orderId: updated.id }
    });
    
    return updated;
  }

  async createShipment(dto: any) {
    const order = await this.orderRepo.findById(dto.orderId);
    if (!order) throw new Error("Order not found");
    
    const shipment = {
      id: randomUUID(),
      orderId: order.id,
      shipmentNumber: `SH-${Date.now()}`,
      status: "DRAFT",
      deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
      items: (dto.items ?? []).map((it: any) => ({
        orderItemId: it.orderItemId,
        deliveredQuantity: it.deliveredQuantity
      }))
    };
    
    const savedShipment = await this.orderRepo.saveShipment(shipment);
    return savedShipment;
  }
}