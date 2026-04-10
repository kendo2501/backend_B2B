import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { IAttachmentRepositoryPort } from "../application/ports/file.ports";

@Injectable()
export class PrismaAttachmentRepository implements IAttachmentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async saveAttachment(data: any): Promise<any> {
    return this.prisma.attachment.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        documentType: data.documentType,
        uploadedById: data.uploadedById
      }
    });
  }

  async findByEntity(entityType: string, entityId: string): Promise<any[]> {
    return this.prisma.attachment.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: "desc" }
    });
  }
}