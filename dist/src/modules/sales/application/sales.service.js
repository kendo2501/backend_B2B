"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
/* * TẦNG APPLICATION (USE CASES)
 * Tuyệt đối KHÔNG import @nestjs/common hay các class hạ tầng (OutboxPublisher) vào đây.
 *
 * NOTE: File này đã được refactor để tuân thủ Single Responsibility Principle.
 * Các logic đã được "tách" ra các Use Case riêng lẻ.
 * File này được "giữ lại" đóng vai trò là Facade Pattern để không làm gãy Controller.
 */
class SalesService {
    createQuoteUseCase;
    confirmOrderUseCase;
    createShipmentUseCase;
    constructor(createQuoteUseCase, confirmOrderUseCase, createShipmentUseCase) {
        this.createQuoteUseCase = createQuoteUseCase;
        this.confirmOrderUseCase = confirmOrderUseCase;
        this.createShipmentUseCase = createShipmentUseCase;
    }
    async createQuote(dto) {
        return this.createQuoteUseCase.execute(dto);
    }
    async confirmOrder(orderId) {
        return this.confirmOrderUseCase.execute(orderId);
    }
    async createShipment(dto) {
        return this.createShipmentUseCase.execute(dto);
    }
}
exports.SalesService = SalesService;
