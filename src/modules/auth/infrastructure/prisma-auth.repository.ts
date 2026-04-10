import { Injectable } from "@nestjs/common";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { IAuthRepository } from "../application/ports/auth.repository.port";

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserWithPermissionsByUsername(username: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { username, isActive: true }, // Luôn nhớ check isActive (Ngày 42)
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: { include: { permission: true } }
              }
            }
          }
        }
      }
    });
  }

  async saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt }
    });
  }
}