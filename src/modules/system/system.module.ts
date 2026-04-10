// src/modules/system/system.module.ts
import { Module } from '@nestjs/common';
import { DashboardController } from './presentation/dashboard.controller';

// CQRS
import { GetDashboardStatsQuery } from './application/queries/get-dashboard-stats.query';
import { GenerateDailyStatsCommand } from './application/commands/generate-daily-stats.command';

// Port & Adapter
import { SYSTEM_REPOSITORY_PORT } from './application/ports/system.repository.port';
import { PrismaSystemRepository } from './infrastructure/prisma-system.repository';

// Infrastructure chung
import { SharedInfrastructureModule } from '../../shared/shared-infrastructure.module';

@Module({
  imports: [SharedInfrastructureModule], 
  controllers: [DashboardController],
  providers: [
    // 1. Đăng ký Query & Command
    GetDashboardStatsQuery,
    GenerateDailyStatsCommand,
    
    // 2. Kết nối Interface (Port) với thực thi Prisma (Adapter)
    {
      provide: SYSTEM_REPOSITORY_PORT,
      useClass: PrismaSystemRepository
    }
  ],
  exports: [GenerateDailyStatsCommand], 
})
export class SystemModule {}