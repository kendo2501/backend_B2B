import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { ISystemRepository } from "../application/ports/system.repository.port";

@Injectable()
export class PrismaSystemRepository implements ISystemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getRealtimeDashboardStats(): Promise<any> {
    // Chạy các truy vấn song song để tăng tốc độ load Dashboard
    const [totalUsers, totalProducts, orderAgg, debtAgg] = await Promise.all([
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.count(), // Có thể query thêm trạng thái COMPLETED
      this.prisma.debtLedger.aggregate({ _sum: { amount: true } })
    ]);

    return {
      activeUsers: totalUsers,
      activeProducts: totalProducts,
      totalOrders: orderAgg,
      totalSystemDebt: debtAgg._sum.amount?.toString() || "0"
    };
  }

  async generateAndSaveDailyStats(date: Date): Promise<any> {
    // Trong ERP thực tế, hàm này sẽ lấy dữ liệu tổng hợp trong ngày
    // và ghi vào một bảng Materialized View (ví dụ bảng `DailyStatistic`) 
    // để các báo cáo sau này truy vấn cực nhanh mà không cần tính lại.
    
    // Giả lập logic lưu trữ
    return {
      success: true,
      message: `Đã chốt số liệu thống kê cho ngày ${date.toISOString().split('T')[0]}`,
      executedAt: new Date()
    };
  }
}