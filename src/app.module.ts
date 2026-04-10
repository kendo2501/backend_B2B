import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedInfrastructureModule } from "./shared/shared-infrastructure.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { ProcurementModule } from "./modules/procurement/procurement.module";
import { SalesModule } from "./modules/sales/sales.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { FilesModule } from "./modules/files/files.module";
import { SystemModule } from "./modules/system/system.module";
import { BffModule } from "./modules/bff/bff.module";

import { PartnersModule } from "./modules/partners/partners.module";
import { PricingModule } from "./modules/pricing/pricing.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { JobsModule } from "./modules/jobs/jobs.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedInfrastructureModule,
    AuthModule,
    PartnersModule,      // Quản lý Đối tác: Khách hàng B2B & Nhà cung cấp
    CatalogModule,
    PricingModule,       // Quản lý Bảng giá và Chiến lược chiết khấu
    InventoryModule,
    ProcurementModule,
    SalesModule,
    FinanceModule,
    FilesModule,
    SystemModule,
    NotificationsModule, // Xử lý WebSockets, bắn thông báo thời gian thực
    JobsModule,          // Quản lý Message Queue, Background Jobs & Cronjobs
    BffModule
  ]
})
export class AppModule {}