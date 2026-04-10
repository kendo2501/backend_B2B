import { Module } from "@nestjs/common";
import { FilesController } from "./presentation/files.controller";
import { FILE_STORAGE_PORT, ATTACHMENT_REPOSITORY_PORT } from "./application/ports/file.ports";
import { S3FileStorageAdapter } from "./infrastructure/s3-file-storage.adapter";
import { PrismaAttachmentRepository } from "./infrastructure/prisma-attachment.repository";
import { GenerateUploadUrlUseCase } from "./application/use-cases/generate-upload-url.use-case";
import { ConfirmUploadUseCase } from "./application/use-cases/confirm-upload.use-case";

@Module({
  controllers: [FilesController],
  providers: [
    GenerateUploadUrlUseCase,
    ConfirmUploadUseCase,
    {
      provide: FILE_STORAGE_PORT,
      useClass: S3FileStorageAdapter
    },
    {
      provide: ATTACHMENT_REPOSITORY_PORT,
      useClass: PrismaAttachmentRepository
    }
  ]
})
export class FilesModule {}