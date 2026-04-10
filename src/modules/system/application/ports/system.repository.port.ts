export const SYSTEM_REPOSITORY_PORT = Symbol("SYSTEM_REPOSITORY_PORT");

export interface ISystemRepository {
  // Phục vụ luồng Query (Đọc dữ liệu nhanh)
  getRealtimeDashboardStats(): Promise<any>;
  
  // Phục vụ luồng Command (Xử lý và lưu trữ dữ liệu nặng cuối ngày)
  generateAndSaveDailyStats(date: Date): Promise<any>;
}