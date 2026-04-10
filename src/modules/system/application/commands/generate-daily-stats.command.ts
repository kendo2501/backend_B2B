import { Inject, Injectable, Logger } from "@nestjs/common";
import { ISystemRepository, SYSTEM_REPOSITORY_PORT } from "../ports/system.repository.port";

@Injectable()
export class GenerateDailyStatsCommand {
  private readonly logger = new Logger(GenerateDailyStatsCommand.name);

  constructor(
    @Inject(SYSTEM_REPOSITORY_PORT) 
    private readonly repo: ISystemRepository
  ) {}

  async execute() {
    this.logger.log("Bắt đầu tiến trình tổng hợp số liệu cuối ngày...");
    
    const today = new Date();
    const result = await this.repo.generateAndSaveDailyStats(today);
    
    this.logger.log("Hoàn tất tiến trình tổng hợp số liệu.");
    return result;
  }
}