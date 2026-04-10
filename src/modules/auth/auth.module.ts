import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./presentation/auth.controller";
import { AuthService } from "./application/auth.service";
import { AUTH_REPOSITORY } from "./application/ports/auth.repository.port";
import { PrismaAuthRepository } from "./infrastructure/prisma-auth.repository";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET ?? "change-me-access",
      signOptions: { expiresIn: process.env.JWT_ACCESS_TTL ?? "15m" }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Đăng ký Provider map Interface với Prisma Adapter
    {
      provide: AUTH_REPOSITORY,
      useClass: PrismaAuthRepository,
    }
  ],
  exports: [AuthService]
})
export class AuthModule {}