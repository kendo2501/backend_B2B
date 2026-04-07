import { Module } from "@nestjs/common";
import { SalesController } from "./presentation/sales.controller";
import { SalesService } from "./application/sales.service";
import { PricingEngine } from "./domain/pricing/pricing.engine";

@Module({
  controllers: [SalesController],
  providers: [SalesService, PricingEngine]
})
export class SalesModule {}
