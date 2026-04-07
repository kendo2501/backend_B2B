import { Body, Controller, Post } from "@nestjs/common";
import { SalesService } from "../application/sales.service";

@Controller("sales")
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Post("quotes")
  createQuote(@Body() body: any) {
    return this.service.createQuote(body);
  }

  @Post("orders/:id/confirm")
  confirm(@Body() body: any) {
    return this.service.confirmOrder(body.orderId);
  }

  @Post("shipments")
  createShipment(@Body() body: any) {
    return this.service.createShipment(body);
  }
}
