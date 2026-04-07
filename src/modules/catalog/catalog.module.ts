import { Module } from "@nestjs/common";
import { CatalogController } from "./presentation/catalog.controller";
import { CatalogService } from "./application/catalog.service";
import { PrismaProductRepository } from "./infrastructure/prisma-product.repository";

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogService,

    {
      provide: "ProductRepositoryPort",
      useClass: PrismaProductRepository,
    },
  ],
  exports: [CatalogService],
})
export class CatalogModule {}