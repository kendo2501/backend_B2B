import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { IFileStoragePort, FILE_STORAGE_PORT } from "../ports/file.ports";
import { GenerateUploadUrlDto } from "../../presentation/dto/file-upload.dto";

@Injectable()
export class GenerateUploadUrlUseCase {
  constructor(
    @Inject(FILE_STORAGE_PORT) private readonly storage: IFileStoragePort
  ) {}

  async execute(dto: GenerateUploadUrlDto, userId: string) {
    // 1. Tạo File Key độc nhất (Tránh trùng tên file)
    const ext = dto.fileName.split('.').pop();
    const uniqueFileId = randomUUID();
    const fileKey = `${dto.entityType.toLowerCase()}s/${dto.entityId}/${uniqueFileId}.${ext}`;

    // 2. Gọi Adapter xin cấp quyền (URL)
    const presignedUrl = await this.storage.generatePresignedUploadUrl(fileKey, dto.contentType);

    return {
      uploadUrl: presignedUrl,
      fileKey: fileKey, // FE cần giữ fileKey này để gọi hàm Confirm sau khi upload xong
      expiresIn: 900 // 15 phút
    };
  }
}