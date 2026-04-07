import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { randomUUID } from "crypto";
import Decimal from "decimal.js";

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async recordDebt(dto: { partnerId: string; transactionType: string; amount: string; referenceId?: string; periodId?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const last = await tx.debtLedger.findFirst({
        where: { partnerId: dto.partnerId },
        orderBy: { createdAt: "desc" }
      });
      const balanceBefore = new Decimal(last?.balanceAfter ?? 0);
      const amount = new Decimal(dto.amount);
      const balanceAfter = balanceBefore.add(amount);

      return tx.debtLedger.create({
        data: {
          id: randomUUID(),
          partnerId: dto.partnerId,
          transactionType: dto.transactionType,
          amount: amount.toFixed(2),
          balanceAfter: balanceAfter.toFixed(2),
          referenceId: dto.referenceId ?? null,
          periodId: dto.periodId ?? null
        }
      });
    });
  }

  async checkCreditLimit(partnerId: string, orderValue: string) {
    const partner = await this.prisma.businessPartner.findUnique({ where: { id: partnerId } });
    if (!partner) throw new Error("Partner not found");
    const currentDebt = new Decimal(partner.currentDebt.toString());
    const creditLimit = new Decimal(partner.creditLimit.toString());
    const order = new Decimal(orderValue);
    if (currentDebt.add(order).gt(creditLimit)) {
      throw new ConflictException("Credit limit exceeded");
    }
    return { approved: true, remainingCredit: creditLimit.sub(currentDebt).sub(order).toFixed(2) };
  }

  async allocatePayment(dto: { paymentId?: string; partnerId: string; amount: string; paymentMethod?: string; invoiceId?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          id: randomUUID(),
          paymentNumber: `PAY-${Date.now()}`,
          partnerId: dto.partnerId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod ?? null,
          unallocatedAmount: dto.amount
        }
      });

      let remaining = new Decimal(dto.amount);
      const debts = await tx.debtLedger.findMany({
        where: { partnerId: dto.partnerId },
        orderBy: { createdAt: "asc" }
      });

      for (const debt of debts) {
        if (remaining.lte(0)) break;
        const alreadyAllocated = await tx.paymentAllocation.aggregate({
          where: { invoiceId: debt.referenceId ?? undefined },
          _sum: { allocatedAmount: true }
        });
        const due = new Decimal(debt.amount.toString()).minus(new Decimal(alreadyAllocated._sum.allocatedAmount ?? 0));
        if (due.lte(0)) continue;
        const allocate = Decimal.min(due, remaining);
        await tx.paymentAllocation.create({
          data: {
            id: randomUUID(),
            paymentId: payment.id,
            invoiceId: debt.referenceId,
            allocatedAmount: allocate.toFixed(2)
          }
        });
        remaining = remaining.sub(allocate);
      }

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          unallocatedAmount: remaining.toFixed(2)
        }
      });

      return { paymentId: payment.id, remaining: remaining.toFixed(2) };
    });
  }

  async agingReport(partnerId?: string) {
    const rows = await this.prisma.debtLedger.findMany({
      where: partnerId ? { partnerId } : {},
      orderBy: { createdAt: "asc" }
    });
    return rows;
  }

  async closePeriod(periodName: string, closedBy?: string) {
    const period = await this.prisma.accountingPeriod.findUnique({ where: { periodName } });
    if (!period) throw new Error("Period not found");
    if (period.isClosed) throw new ConflictException("Period already closed");
    return this.prisma.accountingPeriod.update({
      where: { periodName },
      data: { isClosed: true, closedAt: new Date(), closedBy: closedBy ?? null }
    });
  }
}
