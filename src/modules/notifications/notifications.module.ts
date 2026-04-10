import { Module } from "@nestjs/common";
import { NotificationsGateway } from "./presentation/notifications.gateway";
import { NotificationsListener } from "./presentation/notifications.listener";

@Module({
  providers: [NotificationsGateway,NotificationsListener]
})
export class NotificationsModule {}