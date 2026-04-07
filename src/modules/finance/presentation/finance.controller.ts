import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { FinanceService } from "../application/finance.service";

@Controller("finance")
export class FinanceController {
  constructor(private readonly service: FinanceService) {}

  @Post("debt")
  recordDebt(@Body() body: any) {
    return this.service.recordDebt(body);
  }

  @Post("credit-limit/check")
  checkCredit(@Body() body: any) {
    return this.service.checkCreditLimit(body.partnerId, body.orderValue);
  }

  @Post("payments/allocate")
  allocate(@Body() body: any) {
    return this.service.allocatePayment(body);
  }

  @Get("aging")
  aging(@Query("partnerId") partnerId?: string) {
    return this.service.agingReport(partnerId);
  }

  @Post("periods/close")
  close(@Body() body: any) {
    return this.service.closePeriod(body.periodName, body.closedBy);
  }
}
