"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
/* * TẦNG APPLICATION (FACADE)
 * Đã bóc tách Single Responsibility Principle.
 * Giữ lại làm Controller Wrapper để không gãy hệ thống.
 * Tuyệt đối KHÔNG import @nestjs/common, Prisma, hay OutboxPublisher vào đây.
 */
class InventoryService {
    reserveInventoryUseCase;
    deductInventoryUseCase;
    getAvailableInventoryQuery;
    constructor(reserveInventoryUseCase, deductInventoryUseCase, getAvailableInventoryQuery) {
        this.reserveInventoryUseCase = reserveInventoryUseCase;
        this.deductInventoryUseCase = deductInventoryUseCase;
        this.getAvailableInventoryQuery = getAvailableInventoryQuery;
    }
    async reserve(dto) {
        return this.reserveInventoryUseCase.execute(dto);
    }
    async deduct(dto) {
        return this.deductInventoryUseCase.execute(dto);
    }
    async getAvailable(productId, warehouseId) {
        return this.getAvailableInventoryQuery.execute(productId, warehouseId);
    }
}
exports.InventoryService = InventoryService;
