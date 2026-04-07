import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./presentation/auth.controller";
import { AuthService } from "./application/auth.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET ?? "change-me-access",
      signOptions: { expiresIn: process.env.JWT_ACCESS_TTL ?? "15m" }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
