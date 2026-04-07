import { Module } from "@nestjs/common";
import { BffController } from "./presentation/bff.controller";

@Module({
  controllers: [BffController]
})
export class BffModule {}
