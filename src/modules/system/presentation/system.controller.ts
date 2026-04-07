import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";

@Controller("system")
export class SystemController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("stats")
  async stats() {
    const [products, orders, debt] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.debtLedger.aggregate({ _sum: { amount: true } })
    ]);

    return {
      products,
      orders,
      totalDebt: debt._sum.amount ?? "0"
    };
  }
}
