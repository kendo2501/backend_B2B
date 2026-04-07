import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { PrismaService } from "@shared/infrastructure/prisma/prisma.service";
import { randomUUID } from "crypto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async login(dto: { username: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
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
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const permissions = Array.from(new Set(
      user.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.code))
    ));

    const payload = { sub: user.id, username: user.username, permissions };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET ?? "change-me-access",
      expiresIn: process.env.JWT_ACCESS_TTL ?? "15m"
    });

    const refreshToken = await this.jwt.signAsync({ sub: user.id, jti: randomUUID() }, {
      secret: process.env.JWT_REFRESH_SECRET ?? "change-me-refresh",
      expiresIn: process.env.JWT_REFRESH_TTL ?? "30d"
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await argon2.hash(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000)
      }
    });

    return { accessToken, refreshToken, user: { id: user.id, username: user.username, permissions } };
  }
}
