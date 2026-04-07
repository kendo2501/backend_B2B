import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./shared/infrastructure/http/global-exception.filter";
import { CorrelationIdMiddleware } from "./shared/infrastructure/http/correlation-id.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(new CorrelationIdMiddleware().use);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix("api/v1");
  app.enableCors({ origin: true, credentials: true });
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}
bootstrap();
