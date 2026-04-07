import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CatalogService } from "../application/catalog.service";

@Controller("catalog/products")
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.createProduct(body);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any) {
    return this.service.updateProduct(id, body);
  }

  @Get()
  search(@Query() query: Record<string, any>) {
    return this.service.search(query);
  }
}
