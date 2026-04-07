import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { InventoryService } from "../application/inventory.service";

@Controller("inventory")
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get("available")
  getAvailable(@Query("productId") productId: string, @Query("warehouseId") warehouseId: string) {
    return this.service.getAvailable(productId, warehouseId);
  }

  @Post("reserve")
  reserve(@Body() body: any) {
    return this.service.reserve(body);
  }

  @Post("deduct")
  deduct(@Body() body: any) {
    return this.service.deduct(body);
  }
}
