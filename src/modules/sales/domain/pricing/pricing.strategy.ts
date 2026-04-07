import Decimal from "decimal.js";

export interface PricingContext {
  customerTier: string;
  listPrice: string;
  quantity: string;
  contractPrice?: string | null;
}

export interface PricingStrategy {
  supports(ctx: PricingContext): boolean;
  calculate(ctx: PricingContext): {
    unitPrice: string;
    discountAmount: string;
    subtotal: string;
    taxAmount: string;
    total: string;
  };
}

function r2(v: Decimal) {
  return v.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
}

export class ContractPricingStrategy implements PricingStrategy {
  supports(ctx: PricingContext): boolean {
    return !!ctx.contractPrice;
  }
  calculate(ctx: PricingContext) {
    const q = new Decimal(ctx.quantity);
    const list = new Decimal(ctx.listPrice);
    const contract = new Decimal(ctx.contractPrice ?? ctx.listPrice);
    const subtotal = contract.mul(q);
    const discountAmount = list.mul(q).minus(subtotal);
    const taxAmount = subtotal.mul(0.1);
    return { unitPrice: r2(contract), discountAmount: r2(discountAmount), subtotal: r2(subtotal), taxAmount: r2(taxAmount), total: r2(subtotal.add(taxAmount)) };
  }
}

export class TierPricingStrategy implements PricingStrategy {
  supports(ctx: PricingContext): boolean {
    return !ctx.contractPrice;
  }
  calculate(ctx: PricingContext) {
    const q = new Decimal(ctx.quantity);
    const list = new Decimal(ctx.listPrice);
    const discountRate = ctx.customerTier === "A" ? 0.35 : ctx.customerTier === "B" ? 0.25 : ctx.customerTier === "C" ? 0.15 : 0;
    const unit = list.mul(new Decimal(1).minus(discountRate));
    const subtotal = unit.mul(q);
    const discountAmount = list.mul(q).minus(subtotal);
    const taxAmount = subtotal.mul(0.1);
    return { unitPrice: r2(unit), discountAmount: r2(discountAmount), subtotal: r2(subtotal), taxAmount: r2(taxAmount), total: r2(subtotal.add(taxAmount)) };
  }
}
