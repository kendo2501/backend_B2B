"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogModule = void 0;
const common_1 = require("@nestjs/common");
const catalog_controller_1 = require("./presentation/catalog.controller");
const catalog_service_1 = require("./application/catalog.service");
const prisma_product_repository_1 = require("./infrastructure/prisma-product.repository");
const outbox_event_publisher_adapter_1 = require("./infrastructure/outbox-event.publisher.adapter");
const event_publisher_port_1 = require("./application/ports/event.publisher.port");
const shared_infrastructure_module_1 = require("../../shared/shared-infrastructure.module");
// Import các Use Case và Query
const create_product_use_case_1 = require("./application/use-cases/create-product.use-case");
const update_product_use_case_1 = require("./application/use-cases/update-product.use-case");
const get_products_query_1 = require("./application/queries/get-products.query");
let CatalogModule = class CatalogModule {
};
exports.CatalogModule = CatalogModule;
exports.CatalogModule = CatalogModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_infrastructure_module_1.SharedInfrastructureModule],
        controllers: [catalog_controller_1.CatalogController],
        providers: [
            // 1. Facade
            catalog_service_1.CatalogService,
            // 2. Use Cases & Queries
            create_product_use_case_1.CreateProductUseCase,
            update_product_use_case_1.UpdateProductUseCase,
            get_products_query_1.GetProductsQuery,
            // 3. Đăng ký Database Adapter
            {
                provide: 'ProductRepositoryPort',
                useClass: prisma_product_repository_1.PrismaProductRepository,
            },
            // 4. Đăng ký Event Publisher Adapter
            {
                provide: event_publisher_port_1.CATALOG_EVENT_PUBLISHER_PORT,
                useClass: outbox_event_publisher_adapter_1.OutboxEventPublisherAdapter,
            },
        ],
    })
], CatalogModule);
