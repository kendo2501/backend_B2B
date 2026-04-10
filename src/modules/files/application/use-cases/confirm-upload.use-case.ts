import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { IFileStoragePort, FILE_STORAGE_PORT, IAttachmentRepositoryPort, ATTACHMENT_REPOSITORY_PORT } from "../ports/file.ports";

@Injectable()
export class ConfirmUploadUseCase {
  constructor(
    @Inject(FILE_STORAGE_PORT) private readonly storage: IFileStoragePort,
    @Inject(ATTACHMENT_REPOSITORY_PORT) private readonly repo: IAttachmentRepositoryPort
  ) {}

  async execute(fileKey: string, entityType: string, entityId: string, documentType: string, userId: string) {
    // 1. Kiểm tra xem file đã thực sự được up lên S3 chưa
    const exists = await this.storage.checkFileExists(fileKey);
    if (!exists) {
      throw new BadRequestException("Không tìm thấy file trên Cloud Storage. Vui lòng upload lại.");
    }

    // 2. Lưu thông tin (Meta data) vào Database
    const attachment = await this.repo.saveAttachment({
      entityType,
      entityId,
      fileName: fileKey.split('/').pop(),
      fileUrl: fileKey, // Chỉ lưu đường dẫn tương đối (Key)
      documentType,
      uploadedById: userId
    });

    return attachment;
  }
}