import { ConflictError } from "@shared/domain/errors";

export type OrderState = "DRAFT" | "QUOTED" | "PENDING_APPROVAL" | "CONFIRMED" | "PARTIALLY_DELIVERED" | "COMPLETED" | "CANCELLED";

const transitions: Record<OrderState, OrderState[]> = {
  DRAFT: ["QUOTED", "CANCELLED"],
  QUOTED: ["PENDING_APPROVAL", "CONFIRMED", "CANCELLED"],
  PENDING_APPROVAL: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PARTIALLY_DELIVERED", "COMPLETED", "CANCELLED"],
  PARTIALLY_DELIVERED: ["PARTIALLY_DELIVERED", "COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: []
};

export class OrderStateMachine {
  static transition(from: OrderState, to: OrderState) {
    if (!transitions[from].includes(to)) {
      throw new ConflictError(`Invalid transition ${from} -> ${to}`);
    }
    return to;
  }
}
