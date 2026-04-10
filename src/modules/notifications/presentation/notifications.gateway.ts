import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnEvent } from "@nestjs/event-emitter";
import { Logger } from "@nestjs/common";

// Khởi tạo cổng WebSockets. Trong thực tế, bạn nên config CORS chặt chẽ hơn.
@WebSocketGateway({ 
  cors: { origin: '*' },
  namespace: '/notifications' // Endpoint kết nối từ Frontend
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  // 1. Quản lý vòng đời kết nối
  handleConnection(client: Socket) {
    this.logger.log(`🟢 Client connected: ${client.id}`);
    
    // TƯ DUY SENIOR: Trong thực tế, tại đây bạn sẽ trích xuất JWT Token 
    // từ `client.handshake.auth.token` để lấy ra `userId`.
    // Sau đó gọi lệnh: client.join(`user_${userId}`);
    // Để sau này có thể gửi thông báo riêng tư (Private Message) cho đúng người đó.
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔴 Client disconnected: ${client.id}`);
  }

  // =========================================================================
  // 2. LẮNG NGHE SỰ KIỆN TỪ BACKEND VÀ ĐẨY XUỐNG FRONTEND
  // =========================================================================

  // Lắng nghe sự kiện: Hàng về kho (Từ phân hệ Procurement)
  // @OnEvent('procurement.goods.received')
  // handleGoodsReceived(payload: any) {
  //   this.logger.log(`Đang push WebSockets: Thông báo nhập hàng ${payload.grnId}`);
    
  //   // Phát (emit) một gói tin có tên 'system_notification' xuống Frontend
  //   this.server.emit('system_notification', {
  //     id: Date.now().toString(),
  //     title: "📦 Hàng đã về kho!",
  //     message: `Phiếu nhập kho ${payload.grnId} vừa được xử lý thành công.`,
  //     type: "SUCCESS",
  //     data: payload,
  //     timestamp: new Date()
  //   });
  // }

  // // Lắng nghe sự kiện: Đơn hàng vừa chốt (Từ phân hệ Sales)
  // @OnEvent('sales.order.confirmed')
  // handleOrderConfirmed(payload: any) {
  //   this.logger.log(`Đang push WebSockets: Thông báo đơn hàng mới ${payload.orderId}`);
    
  //   // Trong thực tế, ta có thể dùng `this.server.to('room_kho').emit(...)` 
  //   // để chỉ gửi thông báo này cho các tài khoản thuộc phòng ban Kho.
  //   this.server.emit('system_notification', {
  //     id: Date.now().toString(),
  //     title: "💰 Có đơn hàng mới chốt!",
  //     message: `Đơn hàng ${payload.orderId} vừa được duyệt. Thủ kho vui lòng chuẩn bị xuất hàng.`,
  //     type: "INFO",
  //     data: payload,
  //     timestamp: new Date()
  //   });
  // }
}