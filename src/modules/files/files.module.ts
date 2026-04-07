import { Module } from "@nestjs/common";
import { FilesController } from "./presentation/files.controller";

@Module({
  controllers: [FilesController]
})
export class FilesModule {}
