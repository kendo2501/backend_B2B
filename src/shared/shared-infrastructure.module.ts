import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./infrastructure/prisma/prisma.service";
import { RedisService } from "./infrastructure/redis/redis.service";
import { KafkaService } from "./infrastructure/kafka/kafka.service";
import { OutboxPublisher } from "./infrastructure/outbox/outbox.publisher";

@Global()
@Module({
  providers: [PrismaService, RedisService, KafkaService, OutboxPublisher],
  exports: [PrismaService, RedisService, KafkaService, OutboxPublisher]
})
export class SharedInfrastructureModule {}
