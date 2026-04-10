import { IsNotEmpty, IsString, IsUUID, IsIn, IsMimeType } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GenerateUploadUrlDto {
  @ApiProperty({ description: "Tên file gốc", example: "bao_gia_thang_10.pdf" })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ description: "Loại MimeType", example: "application/pdf" })
  @IsMimeType({ message: "Phải là một MimeType hợp lệ" })
  @IsNotEmpty()
  contentType!: string;

  @ApiProperty({ description: "Thực thể gắn kèm (Order, Product, Partner)", example: "Order" })
  @IsString()
  @IsIn(["Order", "Product", "BusinessPartner", "PurchaseOrder"])
  entityType!: string;

  @ApiProperty({ description: "ID của thực thể", example: "uuid-order-1" })
  @IsUUID()
  @IsNotEmpty()
  entityId!: string;
}

export class ConfirmUploadDto {
  @ApiProperty({ description: "Đường dẫn File Key (Path trên S3)", example: "orders/uuid/bao_gia.pdf" })
  @IsString()
  @IsNotEmpty()
  fileKey!: string;

  @ApiProperty({ description: "Loại chứng từ", example: "CO_CQ" })
  @IsString()
  @IsNotEmpty()
  documentType!: string;
}