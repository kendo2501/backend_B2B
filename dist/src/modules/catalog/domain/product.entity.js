"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductEntity = void 0;
const errors_1 = require("@shared/domain/errors");
class ProductEntity {
    id;
    sku;
    name;
    categoryId;
    baseUnit;
    displayUnit;
    attributes;
    isActive;
    standardCost;
    listPrice;
    constructor(id, sku, name, categoryId, baseUnit, displayUnit, attributes, isActive, standardCost, listPrice) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.categoryId = categoryId;
        this.baseUnit = baseUnit;
        this.displayUnit = displayUnit;
        this.attributes = attributes;
        this.isActive = isActive;
        this.standardCost = standardCost;
        this.listPrice = listPrice;
        if (!sku?.trim())
            throw new errors_1.ValidationError("SKU is required");
        if (!name?.trim())
            throw new errors_1.ValidationError("Product name is required");
    }
}
exports.ProductEntity = ProductEntity;
