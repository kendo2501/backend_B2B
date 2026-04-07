import { Controller, Get } from "@nestjs/common";

@Controller("files")
export class FilesController {
  @Get("presign")
  presign() {
    return {
      uploadUrl: "http://localhost:9000/mini-erp/example-file",
      method: "PUT",
      expiresInSeconds: 300
    };
  }
}
