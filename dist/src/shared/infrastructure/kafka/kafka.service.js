"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
const common_1 = require("@nestjs/common");
const kafkajs_1 = require("kafkajs");
let KafkaService = class KafkaService {
    producer;
    kafka = new kafkajs_1.Kafka({
        clientId: "mini-erp",
        brokers: (process.env.KAFKA_BROKERS ?? "localhost:9092").split(",")
    });
    async onModuleInit() {
        this.producer = this.kafka.producer();
        await this.producer.connect();
    }
    async publish(topic, payload) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(payload) }]
        });
    }
};
exports.KafkaService = KafkaService;
exports.KafkaService = KafkaService = __decorate([
    (0, common_1.Injectable)()
], KafkaService);
