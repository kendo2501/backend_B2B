"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModule = void 0;
const common_1 = require("@nestjs/common");
const sales_controller_1 = require("./presentation/sales.controller");
const sales_service_1 = require("./application/sales.service");
const outbox_event_publisher_adapter_1 = require("./infrastructure/outbox-event.publisher.adapter");
const event_publisher_port_1 = require("./application/ports/event.publisher.port");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        controllers: [sales_controller_1.SalesController],
        providers: [
            sales_service_1.SalesService,
            // Binding Port với Adapter: Khi có ai đòi EventPublisherPort, hãy đưa cho họ OutboxEventPublisherAdapter
            {
                provide: event_publisher_port_1.EventPublisherPort,
                useClass: outbox_event_publisher_adapter_1.OutboxEventPublisherAdapter,
            },
            // ... các provider khác (PricingEngine, OrderRepository...)
        ],
    })
], SalesModule);
