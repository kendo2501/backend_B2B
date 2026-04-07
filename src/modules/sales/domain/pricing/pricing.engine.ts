import { Injectable } from "@nestjs/common";
import { ContractPricingStrategy, PricingContext, PricingStrategy, TierPricingStrategy } from "./pricing.strategy";

@Injectable()
export class PricingEngine {
  private readonly strategies: PricingStrategy[] = [
    new ContractPricingStrategy(),
    new TierPricingStrategy()
  ];

  quote(ctx: PricingContext) {
    const strategy = this.strategies.find((s) => s.supports(ctx));
    if (!strategy) throw new Error("No pricing strategy matched");
    return strategy.calculate(ctx);
  }
}
