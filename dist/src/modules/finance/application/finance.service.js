"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const crypto_1 = require("crypto");
const decimal_js_1 = __importDefault(require("decimal.js"));
const errors_1 = require("@shared/domain/errors");
class FinanceService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async recordDebt(dto) {
        // Việc lấy số dư cuối (last balance) và cộng tiền được gói gọn trong Port 
        // để đảm bảo an toàn đa luồng (Transaction Isolation).
        return this.repo.executeRecordDebtTransaction(dto);
    }
    async checkCreditLimit(partnerId, orderValue) {
        const partner = await this.repo.getPartner(partnerId);
        if (!partner)
            throw new Error("Partner not found");
        const currentDebt = new decimal_js_1.default(partner.currentDebt.toString());
        const creditLimit = new decimal_js_1.default(partner.creditLimit.toString());
        const order = new decimal_js_1.default(orderValue);
        if (currentDebt.add(order).gt(creditLimit)) {
            throw new errors_1.ConflictError("Credit limit exceeded"); // Sử dụng ConflictError chuẩn Domain
        }
        return {
            approved: true,
            remainingCredit: creditLimit.sub(currentDebt).sub(order).toFixed(2)
        };
    }
    async allocatePayment(dto) {
        // 1. Fetch dữ liệu từ DB lên RAM
        const unpaidDebts = await this.repo.getUnpaidDebts(dto.partnerId);
        let remaining = new decimal_js_1.default(dto.amount);
        const allocations = [];
        // 2. Logic tính toán phân bổ FIFO hoàn toàn trên RAM (Không chọc DB trong vòng lặp)
        for (const debt of unpaidDebts) {
            if (remaining.lte(0))
                break;
            const due = new decimal_js_1.default(debt.dueAmount);
            if (due.lte(0))
                continue;
            const allocate = decimal_js_1.default.min(due, remaining);
            allocations.push({
                id: (0, crypto_1.randomUUID)(),
                invoiceId: debt.invoiceId,
                allocatedAmount: allocate.toFixed(2)
            });
            remaining = remaining.sub(allocate);
        }
        const payment = {
            id: (0, crypto_1.randomUUID)(),
            paymentNumber: `PAY-${Date.now()}`,
            partnerId: dto.partnerId,
            amount: dto.amount,
            paymentMethod: dto.paymentMethod ?? null,
            unallocatedAmount: remaining.toFixed(2)
        };
        // 3. Giao cho Port lưu toàn bộ vào DB trong 1 Transaction nguyên tử
        await this.repo.executePaymentAllocationTransaction(payment, allocations);
        return { paymentId: payment.id, remaining: remaining.toFixed(2) };
    }
    async agingReport(partnerId) {
        // Theo Tài liệu Ngày 39, báo cáo này nên đọc từ Read Model (CQRS). 
        // Tạm thời gọi qua Port để tách biệt Prisma.
        return this.repo.getDebtLedger(partnerId);
    }
    async closePeriod(periodName, closedBy) {
        const period = await this.repo.getAccountingPeriod(periodName);
        if (!period)
            throw new Error("Period not found");
        if (period.isClosed)
            throw new errors_1.ConflictError("Period already closed");
        return this.repo.closeAccountingPeriod(periodName, closedBy);
    }
}
exports.FinanceService = FinanceService;
