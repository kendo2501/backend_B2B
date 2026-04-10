"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("@shared/infrastructure/prisma/prisma.service");
const product_entity_1 = require("../domain/product.entity");
const outbox_publisher_1 = require("@shared/infrastructure/outbox/outbox.publisher");
let CatalogService = class CatalogService {
    repo;
    prisma;
    outbox;
    constructor(repo, prisma, outbox) {
        this.repo = repo;
        this.prisma = prisma;
        this.outbox = outbox;
    }
    async createProduct(dto) {
        const existing = await this.repo.findBySku(dto.sku);
        if (existing)
            throw new Error("SKU already exists");
        const product = new product_entity_1.ProductEntity((0, crypto_1.randomUUID)(), dto.sku, dto.name, dto.categoryId ?? null, dto.baseUnit, dto.displayUnit, dto.attributes ?? {}, dto.isActive ?? true, dto.standardCost ?? "0", dto.listPrice ?? "0");
        const saved = await this.repo.create(product);
        await this.outbox.queue({
            aggregateType: "Product",
            aggregateId: saved.id,
            eventType: "catalog.product.created",
            payload: { productId: saved.id, sku: saved.sku }
        });
        return saved;
    }
    async updateProduct(id, dto) {
        const product = await this.repo.findById(id);
        if (!product)
            throw new Error("Product not found");
        if (dto.sku !== undefined)
            product.sku = dto.sku;
        if (dto.name !== undefined)
            product.name = dto.name;
        if (dto.categoryId !== undefined)
            product.categoryId = dto.categoryId;
        if (dto.baseUnit !== undefined)
            product.baseUnit = dto.baseUnit;
        if (dto.displayUnit !== undefined)
            product.displayUnit = dto.displayUnit;
        if (dto.attributes !== undefined)
            product.attributes = dto.attributes;
        if (dto.isActive !== undefined)
            product.isActive = dto.isActive;
        if (dto.standardCost !== undefined)
            product.standardCost = dto.standardCost;
        if (dto.listPrice !== undefined)
            product.listPrice = dto.listPrice;
        const saved = await this.repo.update(product);
        await this.outbox.queue({
            aggregateType: "Product",
            aggregateId: saved.id,
            eventType: "catalog.product.updated",
            payload: { productId: saved.id }
        });
        return saved;
    }
    search(filters) {
        return this.repo.search(filters);
    }
};
exports.CatalogService = CatalogService;
exports.CatalogService = CatalogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ProductRepositoryPort")),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        outbox_publisher_1.OutboxPublisher])
], CatalogService);
