import { Injectable, Logger } from "@nestjs/common";
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IFileStoragePort } from "../application/ports/file.ports";

@Injectable()
export class S3FileStorageAdapter implements IFileStoragePort {
  private readonly s3: S3Client;
  private readonly bucketName = process.env.S3_BUCKET_NAME ?? "minierp-bucket";

  constructor() {
    this.s3 = new S3Client({
      region: process.env.S3_REGION ?? "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? "minioadmin",
        secretAccessKey: process.env.S3_SECRET_KEY ?? "minioadmin",
      },
      endpoint: process.env.S3_ENDPOINT, // Dùng cho MinIO local
      forcePathStyle: true // Bắt buộc nếu dùng MinIO
    });
  }

  async generatePresignedUploadUrl(fileKey: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType
    });
    // Hết hạn sau 15 phút
    return getSignedUrl(this.s3, command, { expiresIn: 900 });
  }

  async generatePresignedDownloadUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey
    });
    return getSignedUrl(this.s3, command, { expiresIn: 900 });
  }

  async checkFileExists(fileKey: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({ Bucket: this.bucketName, Key: fileKey });
      await this.s3.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }
}