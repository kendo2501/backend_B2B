import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../application/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post("login")
  login(@Body() body: { username: string; password: string }) {
    return this.service.login(body);
  }
}
