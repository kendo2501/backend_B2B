import { Body, Controller, Post } from "@nestjs/common";
import { ProcurementService } from "../application/procurement.service";

@Controller("procurement")
export class ProcurementController {
  constructor(private readonly service: ProcurementService) {}

  @Post("requests")
  createRequest(@Body() body: any) {
    return this.service.createPurchaseRequest(body);
  }

  @Post("orders")
  createOrder(@Body() body: any) {
    return this.service.createPurchaseOrder(body);
  }

  @Post("goods-receipts")
  receive(@Body() body: any) {
    return this.service.receiveGoods(body);
  }
}
