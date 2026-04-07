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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedInfrastructureModule,
    AuthModule,
    CatalogModule,
    InventoryModule,
    ProcurementModule,
    SalesModule,
    FinanceModule,
    FilesModule,
    SystemModule,
    BffModule
  ]
})
export class AppModule {}
