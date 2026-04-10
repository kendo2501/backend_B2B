import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { GenerateUploadUrlUseCase } from "../application/use-cases/generate-upload-url.use-case";
import { ConfirmUploadUseCase } from "../application/use-cases/confirm-upload.use-case";
import { GenerateUploadUrlDto, ConfirmUploadDto } from "./dto/file-upload.dto";

@ApiTags("Files (Quản lý tài liệu CO/CQ)")
@Controller("api/v1/files")
export class FilesController {
  constructor(
    private readonly generateUploadUrlUseCase: GenerateUploadUrlUseCase,
    private readonly confirmUploadUseCase: ConfirmUploadUseCase
  ) {}

  @Post("upload-url")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Xin cấp quyền (URL) để upload file lên Cloud" })
  async requestUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    // Mặc định lấy từ Token người dùng (Giả định userId tĩnh để test)
    const userId = "00000000-0000-0000-0000-000000000000"; 
    return this.generateUploadUrlUseCase.execute(dto, userId);
  }

  @Post("confirm")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Xác nhận file đã upload xong, lưu thông tin vào DB" })
  async confirmUpload(
    @Query("entityType") entityType: string,
    @Query("entityId") entityId: string,
    @Body() dto: ConfirmUploadDto
  ) {
    const userId = "00000000-0000-0000-0000-000000000000";
    return this.confirmUploadUseCase.execute(dto.fileKey, entityType, entityId, dto.documentType, userId);
  }
}