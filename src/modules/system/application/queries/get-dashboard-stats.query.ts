import { Inject, Injectable } from "@nestjs/common";
import { ISystemRepository, SYSTEM_REPOSITORY_PORT } from "../ports/system.repository.port";

@Injectable()
export class GetDashboardStatsQuery {
  constructor(
    @Inject(SYSTEM_REPOSITORY_PORT) 
    private readonly repo: ISystemRepository
  ) {}

  async execute() {
    return this.repo.getRealtimeDashboardStats();
  }
}