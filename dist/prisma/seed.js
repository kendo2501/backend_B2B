"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    const permissionCodes = [
        "catalog:read", "catalog:write",
        "inventory:read", "inventory:reserve", "inventory:deduct",
        "sales:read", "sales:write", "sales:approve",
        "finance:read", "finance:write",
        "auth:manage", "file:upload", "report:read"
    ];
    for (const code of permissionCodes) {
        await prisma.permission.upsert({
            where: { code },
            update: {},
            create: { code, description: code }
        });
    }
    const roleNames = ["ADMIN", "SALE_REP", "WAREHOUSE", "ACCOUNTANT", "MANAGER"];
    for (const name of roleNames) {
        await prisma.role.upsert({
            where: { name },
            update: {},
            create: { name, description: name }
        });
    }
    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            passwordHash: await argon2.hash("Admin@123456"),
            isActive: true
        }
    });
    const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
    if (adminRole) {
        await prisma.userRole.upsert({
            where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
            update: {},
            create: { userId: admin.id, roleId: adminRole.id }
        });
    }
    const retail = await prisma.businessPartner.upsert({
        where: { code: "CUST-DEMO" },
        update: {},
        create: { code: "CUST-DEMO", name: "Demo Customer", type: "CUSTOMER", tier: "A", creditLimit: "1000000000.00", currentDebt: "0" }
    });
    const supplier = await prisma.businessPartner.upsert({
        where: { code: "SUP-DEMO" },
        update: {},
        create: { code: "SUP-DEMO", name: "Demo Supplier", type: "SUPPLIER", tier: null, creditLimit: "0", currentDebt: "0" }
    });
    const warehouse = await prisma.warehouse.upsert({
        where: { code: "WH-01" },
        update: {},
        create: { code: "WH-01", name: "Main Warehouse", locationAddress: "Demo" }
    });
    const category = await prisma.category.createMany({
        data: [{ name: "Electrical", parentId: null }],
        skipDuplicates: true
    });
    const categories = await prisma.category.findMany({ where: { name: "Electrical" } });
    const categoryId = categories[0]?.id;
    await prisma.product.upsert({
        where: { sku: "CADIVI-2X2.5" },
        update: {},
        create: {
            sku: "CADIVI-2X2.5",
            name: "Cáp điện Cadivi 2x2.5",
            categoryId,
            baseUnit: "m",
            displayUnit: "cuộn",
            attributes: { section: "2x2.5", type: "cable", unit: "meter" },
            isActive: true,
            standardCost: "12500.00",
            listPrice: "18000.00"
        }
    });
    console.log("Seed complete", { admin: admin.username, retail: retail.code, supplier: supplier.code, warehouse: warehouse.code });
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
