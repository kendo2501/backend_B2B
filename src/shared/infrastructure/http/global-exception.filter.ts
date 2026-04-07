import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const correlationId = ctx.getRequest()?.headers?.["x-correlation-id"] ?? null;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp = exception.getResponse() as any;
      return res.status(status).json({
        success: false,
        message: typeof resp === "string" ? resp : resp.message ?? exception.message,
        errorCode: resp.errorCode ?? "HTTP_ERROR",
        correlationId
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_SERVER_ERROR",
      correlationId
    });
  }
}
