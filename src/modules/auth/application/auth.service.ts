import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { randomUUID } from "crypto";
import { IAuthRepository, AUTH_REPOSITORY } from "./ports/auth.repository.port";
import { LoginDto } from "../presentation/dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    // Tiêm Interface thay vì PrismaService (Dependency Inversion)
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    private readonly jwt: JwtService
  ) {}

  async login(dto: LoginDto) {
    // 1. Lấy thông tin user qua Adapter
    const user = await this.authRepository.findUserWithPermissionsByUsername(dto.username);
    
    if (!user) {
      // Bắn lỗi nghiệp vụ
      throw new UnauthorizedException("Tài khoản hoặc mật khẩu không chính xác");
    }

    // 2. Kiểm tra mật khẩu
    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Tài khoản hoặc mật khẩu không chính xác");
    }

    // 3. Gom quyền (Permissions)
    const permissions = Array.from(new Set(
      user.roles.flatMap((ur: any) => ur.role.permissions.map((rp: any) => rp.permission.code))
    ));

    // 4. Khởi tạo Token
    const payload = { sub: user.id, username: user.username, permissions };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET ?? "change-me-access",
      expiresIn: process.env.JWT_ACCESS_TTL ?? "15m"
    });

    const refreshToken = await this.jwt.signAsync({ sub: user.id, jti: randomUUID() }, {
      secret: process.env.JWT_REFRESH_SECRET ?? "change-me-refresh",
      expiresIn: process.env.JWT_REFRESH_TTL ?? "30d"
    });

    // 5. Lưu Refresh Token qua Adapter
    await this.authRepository.saveRefreshToken(
      user.id,
      await argon2.hash(refreshToken), // Hash trước khi lưu vào DB là tư duy chuẩn
      new Date(Date.now() + 30 * 24 * 3600 * 1000)
    );

    return { 
      accessToken, 
      refreshToken, 
      user: { id: user.id, username: user.username, permissions } 
    };
  }
}