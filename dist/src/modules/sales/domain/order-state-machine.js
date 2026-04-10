"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftState = exports.QuotedState = exports.PendingApprovalState = exports.ConfirmedState = exports.PartiallyDeliveredState = exports.CompletedState = exports.CancelledState = exports.OrderState = void 0;
const errors_1 = require("@shared/domain/errors");
class OrderState {
    orderContext;
    constructor(orderContext) {
        this.orderContext = orderContext;
    }
    quote() {
        throw new errors_1.ConflictError(`Cannot quote order from state ${this.getName()}`);
    }
    requireApproval() {
        throw new errors_1.ConflictError(`Cannot send to approval from state ${this.getName()}`);
    }
    confirm() {
        throw new errors_1.ConflictError(`Cannot confirm order from state ${this.getName()}`);
    }
    ship() {
        throw new errors_1.ConflictError(`Cannot ship order from state ${this.getName()}`);
    }
    complete() {
        throw new errors_1.ConflictError(`Cannot complete order from state ${this.getName()}`);
    }
    cancel() {
        throw new errors_1.ConflictError(`Cannot cancel order from state ${this.getName()}`);
    }
}
exports.OrderState = OrderState;
class CancelledState extends OrderState {
    getName() { return "CANCELLED"; }
}
exports.CancelledState = CancelledState;
class CompletedState extends OrderState {
    getName() { return "COMPLETED"; }
}
exports.CompletedState = CompletedState;
class PartiallyDeliveredState extends OrderState {
    getName() { return "PARTIALLY_DELIVERED"; }
    ship() {
        return this; // Vẫn cho phép tiếp tục tạo phiếu xuất kho cho đến khi đủ số lượng
    }
    complete() {
        return new CompletedState(this.orderContext);
    }
    cancel() {
        return new CancelledState(this.orderContext);
    }
}
exports.PartiallyDeliveredState = PartiallyDeliveredState;
class ConfirmedState extends OrderState {
    getName() { return "CONFIRMED"; }
    ship() {
        return new PartiallyDeliveredState(this.orderContext);
    }
    complete() {
        return new CompletedState(this.orderContext);
    }
    cancel() {
        return new CancelledState(this.orderContext);
    }
}
exports.ConfirmedState = ConfirmedState;
class PendingApprovalState extends OrderState {
    getName() { return "PENDING_APPROVAL"; }
    confirm() {
        return new ConfirmedState(this.orderContext);
    }
    cancel() {
        return new CancelledState(this.orderContext);
    }
}
exports.PendingApprovalState = PendingApprovalState;
class QuotedState extends OrderState {
    getName() { return "QUOTED"; }
    confirm() {
        return new ConfirmedState(this.orderContext);
    }
    requireApproval() {
        return new PendingApprovalState(this.orderContext);
    }
    cancel() {
        return new CancelledState(this.orderContext);
    }
}
exports.QuotedState = QuotedState;
class DraftState extends OrderState {
    getName() { return "DRAFT"; }
    quote() {
        return new QuotedState(this.orderContext);
    }
    cancel() {
        return new CancelledState(this.orderContext);
    }
}
exports.DraftState = DraftState;
