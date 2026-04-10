"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcurementModule = void 0;
const common_1 = require("@nestjs/common");
const procurement_controller_1 = require("./presentation/procurement.controller");
const procurement_service_1 = require("./application/procurement.service");
// Import các Ports (Interfaces)
const procurement_repository_port_1 = require("./application/ports/procurement.repository.port");
const event_publisher_port_1 = require("./application/ports/event.publisher.port");
// Import các Adapters (Implementations)
const prisma_procurement_repository_1 = require("./infrastructure/prisma-procurement.repository");
const outbox_event_publisher_adapter_1 = require("./infrastructure/outbox-event.publisher.adapter");
let ProcurementModule = class ProcurementModule {
};
exports.ProcurementModule = ProcurementModule;
exports.ProcurementModule = ProcurementModule = __decorate([
    (0, common_1.Module)({
        controllers: [procurement_controller_1.ProcurementController],
        providers: [
            // 1. Khai báo Use Case Service chính
            procurement_service_1.ProcurementService,
            // 2. Đăng ký Adapter cho Database (Prisma)
            {
                provide: procurement_repository_port_1.ProcurementRepositoryPort,
                useClass: prisma_procurement_repository_1.PrismaProcurementRepository,
            },
            // 3. Đăng ký Adapter cho Event Publisher (Outbox)
            {
                provide: event_publisher_port_1.EventPublisherPort,
                useClass: outbox_event_publisher_adapter_1.OutboxEventPublisherAdapter,
            },
        ],
    })
], ProcurementModule);
