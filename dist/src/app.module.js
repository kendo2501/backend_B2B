"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const shared_infrastructure_module_1 = require("./shared/shared-infrastructure.module");
const auth_module_1 = require("./modules/auth/auth.module");
const catalog_module_1 = require("./modules/catalog/catalog.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const procurement_module_1 = require("./modules/procurement/procurement.module");
const sales_module_1 = require("./modules/sales/sales.module");
const finance_module_1 = require("./modules/finance/finance.module");
const files_module_1 = require("./modules/files/files.module");
const system_module_1 = require("./modules/system/system.module");
const bff_module_1 = require("./modules/bff/bff.module");
// BỔ SUNG CÁC MODULE CÒN THIẾU
const partners_module_1 = require("./modules/partners/partners.module");
const pricing_module_1 = require("./modules/pricing/pricing.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            shared_infrastructure_module_1.SharedInfrastructureModule,
            auth_module_1.AuthModule,
            partners_module_1.PartnersModule, // Quản lý Đối tác: Khách hàng B2B & Nhà cung cấp
            catalog_module_1.CatalogModule,
            pricing_module_1.PricingModule, // Quản lý Bảng giá và Chiến lược chiết khấu
            inventory_module_1.InventoryModule,
            procurement_module_1.ProcurementModule,
            sales_module_1.SalesModule,
            finance_module_1.FinanceModule,
            files_module_1.FilesModule,
            system_module_1.SystemModule,
            notifications_module_1.NotificationsModule, // Xử lý WebSockets, bắn thông báo thời gian thực
            jobs_module_1.JobsModule, // Quản lý Message Queue, Background Jobs & Cronjobs
            bff_module_1.BffModule
        ]
    })
], AppModule);
