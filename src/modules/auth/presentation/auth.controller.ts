import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "../application/auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Authentication")
@Controller("api/v1/auth") // Thêm versioning cho API
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK) // Login thành công trả về 200 thay vì 201 Created mặc định của NestJS
  @ApiOperation({ summary: "Đăng nhập hệ thống" })
  @ApiResponse({ status: 200, description: "Đăng nhập thành công, trả về Access Token" })
  @ApiResponse({ status: 401, description: "Sai thông tin đăng nhập" })
  @ApiResponse({ status: 400, description: "Dữ liệu đầu vào không hợp lệ (Validation Error)" })
  login(@Body() dto: LoginDto) {
    // Dữ liệu đã được class-validator làm sạch trước khi vào tới đây
    return this.service.login(dto);
  }
}