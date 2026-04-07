import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const prisma = new PrismaClient();
const kafka = new Kafka({
  clientId: "mini-erp-outbox-worker",
  brokers: (process.env.KAFKA_BROKERS ?? "localhost:9092").split(",")
});
const producer = kafka.producer();

async function main() {
  await producer.connect();
  setInterval(async () => {
    const rows = await prisma.outboxEvent.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 50
    });

    for (const row of rows) {
      try {
        await prisma.outboxEvent.update({
          where: { id: row.id },
          data: { status: "PROCESSING" }
        });
        await producer.send({
          topic: row.eventType,
          messages: [{ key: row.aggregateId, value: JSON.stringify(row.payload) }]
        });
        await prisma.outboxEvent.update({
          where: { id: row.id },
          data: { status: "SENT", processedAt: new Date() }
        });
      } catch (e: any) {
        await prisma.outboxEvent.update({
          where: { id: row.id },
          data: { status: "FAILED" }
        });
      }
    }
  }, 1000);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
