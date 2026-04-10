import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationsGateway } from "../presentation/notifications.gateway";

@Injectable()
export class NotificationsListener {
  constructor(private readonly gateway: NotificationsGateway) {}

  @OnEvent('procurement.goods.received')
  handleGoodsReceived(payload: any) {
    this.gateway.server.emit('system_notification', {
      id: Date.now().toString(),
      title: "📦 Hàng đã về kho!",
      message: `Phiếu nhập kho ${payload.grnId} vừa được xử lý.`,
      type: "SUCCESS",
      data: payload,
      timestamp: new Date()
    });
  }

  @OnEvent('sales.order.confirmed')
  handleOrderConfirmed(payload: any) {
    this.gateway.server.emit('system_notification', {
      id: Date.now().toString(),
      title: "💰 Có đơn hàng mới!",
      message: `Đơn hàng ${payload.orderId} vừa được duyệt.`,
      type: "INFO",
      data: payload,
      timestamp: new Date()
    });
  }
}