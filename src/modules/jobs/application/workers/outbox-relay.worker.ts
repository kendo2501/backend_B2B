import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class OutboxRelayWorker {
  private readonly logger = new Logger(OutboxRelayWorker.name);

  // Vẫn giữ cờ này để chặn chính Instance này tự spam (Event-loop level)
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  @Cron("*/5 * * * * *")
  async handleCron() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // 1. ATOMIC CLAIMING: Lấy data và đánh dấu PROCESSING cùng một lúc
      // SKIP LOCKED đảm bảo các Instance khác sẽ tự động bỏ qua 50 record này
      const claimedEvents = await this.prisma.$queryRaw<any[]>`
        UPDATE outbox_events
        SET status = 'PROCESSING'
         WHERE id IN (
          SELECT id FROM outbox_events
          WHERE status = 'PENDING'
          ORDER BY created_at ASC
          LIMIT 50
          FOR UPDATE SKIP LOCKED
         )
      RETURNING *;
      `;

      if (!claimedEvents || claimedEvents.length === 0) {
        this.isProcessing = false;
        return;
      }

      this.logger.debug(`Khóa thành công ${claimedEvents.length} events. Đang xử lý...`);

      // 2. Bắn Event an toàn
      for (const event of claimedEvents) {
        try {
          this.eventEmitter.emit(event.eventType, event.payload);

          // 3. Đánh dấu đã xử lý xong
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: {
              status: "PROCESSED",
              processedAt: new Date()
            }
          });

        } catch (dispatchError: any) {
          this.logger.error(`Lỗi khi bắn event ID ${event.id}:`, dispatchError);
          // Fallback: Đánh dấu lỗi để admin kiểm tra hoặc hệ thống retry
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: "FAILED" }
          });
        }
      }
    } catch (error) {
      this.logger.error("Lỗi hệ thống ở Outbox Relay Worker", error);
    } finally {
      this.isProcessing = false;
    }
  }
}