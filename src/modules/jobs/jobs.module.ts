import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { OutboxRelayWorker } from "./application/workers/outbox-relay.worker";
import { SharedInfrastructureModule } from "../../shared/shared-infrastructure.module";

@Module({
  imports: [
    // Bắt buộc phải import ScheduleModule để kích hoạt các decorator @Cron
    ScheduleModule.forRoot(),
    SharedInfrastructureModule
  ],
  providers: [
    // Đăng ký Worker để NestJS khởi tạo nó khi chạy server
    OutboxRelayWorker
  ]
})
export class JobsModule {}