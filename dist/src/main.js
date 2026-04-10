"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./shared/infrastructure/http/global-exception.filter");
const correlation_id_middleware_1 = require("./shared/infrastructure/http/correlation-id.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.use(new correlation_id_middleware_1.CorrelationIdMiddleware().use);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: true }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.setGlobalPrefix("api/v1");
    app.enableCors({ origin: true, credentials: true });
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
}
bootstrap();
