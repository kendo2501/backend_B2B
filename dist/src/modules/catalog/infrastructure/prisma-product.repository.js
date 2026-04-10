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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProductRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("@shared/infrastructure/prisma/prisma.service");
const product_entity_1 = require("../domain/product.entity");
let PrismaProductRepository = class PrismaProductRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input) {
        const row = await this.prisma.product.create({
            data: {
                id: input.id ?? undefined,
                sku: input.sku,
                name: input.name,
                categoryId: input.categoryId,
                baseUnit: input.baseUnit,
                displayUnit: input.displayUnit,
                attributes: input.attributes,
                isActive: input.isActive,
                standardCost: input.standardCost,
                listPrice: input.listPrice
            }
        });
        return this.map(row);
    }
    async update(input) {
        const row = await this.prisma.product.update({
            where: { id: input.id },
            data: {
                sku: input.sku,
                name: input.name,
                categoryId: input.categoryId,
                baseUnit: input.baseUnit,
                displayUnit: input.displayUnit,
                attributes: input.attributes,
                isActive: input.isActive,
                standardCost: input.standardCost,
                listPrice: input.listPrice
            }
        });
        return this.map(row);
    }
    async findById(id) {
        const row = await this.prisma.product.findUnique({ where: { id } });
        return row ? this.map(row) : null;
    }
    async findBySku(sku) {
        const row = await this.prisma.product.findUnique({ where: { sku } });
        return row ? this.map(row) : null;
    }
    async search(filters) {
        const rows = await this.prisma.product.findMany({
            where: {
                AND: Object.entries(filters).map(([key, value]) => ({
                    attributes: { path: [key], equals: value }
                }))
            }
        });
        return rows.map((r) => this.map(r));
    }
    map(row) {
        return new product_entity_1.ProductEntity(row.id, row.sku, row.name, row.categoryId, row.baseUnit, row.displayUnit, row.attributes ?? {}, row.isActive, String(row.standardCost), String(row.listPrice));
    }
};
exports.PrismaProductRepository = PrismaProductRepository;
exports.PrismaProductRepository = PrismaProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProductRepository);
