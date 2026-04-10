export const FILE_STORAGE_PORT = Symbol("FILE_STORAGE_PORT");
export const ATTACHMENT_REPOSITORY_PORT = Symbol("ATTACHMENT_REPOSITORY_PORT");

// Giao kèo với S3/MinIO
export interface IFileStoragePort {
  generatePresignedUploadUrl(fileKey: string, contentType: string): Promise<string>;
  generatePresignedDownloadUrl(fileKey: string): Promise<string>;
  checkFileExists(fileKey: string): Promise<boolean>;
}

// Giao kèo với DB (Bảng Attachment)
export interface IAttachmentRepositoryPort {
  saveAttachment(data: any): Promise<any>;
  findByEntity(entityType: string, entityId: string): Promise<any[]>;
}