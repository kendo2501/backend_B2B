import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "Tên đăng nhập", example: "admin" })
  @IsString({ message: "Username phải là chuỗi" })
  @IsNotEmpty({ message: "Username không được để trống" })
  username!: string;

  @ApiProperty({ description: "Mật khẩu", example: "Abc@123456" })
  @IsString({ message: "Password phải là chuỗi" })
  @IsNotEmpty({ message: "Password không được để trống" })
  @MinLength(6, { message: "Mật khẩu phải từ 6 ký tự trở lên" })
  password!: string;
}