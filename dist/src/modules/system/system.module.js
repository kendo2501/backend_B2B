"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemModule = void 0;
// src/modules/system/system.module.ts
const common_1 = require("@nestjs/common");
const dashboard_controller_1 = require("./presentation/dashboard.controller");
const get_dashboard_stats_query_1 = require("./application/queries/get-dashboard-stats.query");
const generate_daily_stats_command_1 = require("./application/commands/generate-daily-stats.command");
const shared_infrastructure_module_1 = require("../../shared/shared-infrastructure.module");
let SystemModule = class SystemModule {
};
exports.SystemModule = SystemModule;
exports.SystemModule = SystemModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_infrastructure_module_1.SharedInfrastructureModule],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [
            get_dashboard_stats_query_1.GetDashboardStatsQuery,
            generate_daily_stats_command_1.GenerateDailyStatsCommand,
        ],
        exports: [generate_daily_stats_command_1.GenerateDailyStatsCommand],
    })
], SystemModule);
