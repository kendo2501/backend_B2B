import { Controller, Get, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { GetDashboardStatsQuery } from "../application/queries/get-dashboard-stats.query";
import { GenerateDailyStatsCommand } from "../application/commands/generate-daily-stats.command";

@ApiTags("System & Dashboard (Hệ thống)")
@Controller("api/v1/system")
export class DashboardController {
  constructor(
    private readonly getDashboardStats: GetDashboardStatsQuery,
    private readonly generateDailyStats: GenerateDailyStatsCommand
  ) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Lấy dữ liệu thống kê tổng quan (Realtime)" })
  getDashboard() {
    return this.getDashboardStats.execute();
  }

  @Post("cron/daily-stats")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Trigger thủ công việc chốt số liệu cuối ngày (Dành cho Admin/Cronjob)" })
  triggerDailyStats() {
    return this.generateDailyStats.execute();
  }
}