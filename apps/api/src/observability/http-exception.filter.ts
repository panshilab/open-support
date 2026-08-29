import {
  Catch,
  HttpException,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { REQUEST_ID_HEADER } from './request-context.middleware';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const requestId = response.getHeader(REQUEST_ID_HEADER)?.toString() ?? 'unknown';
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    if (status >= 500)
      this.logger.error(
        `${request.method} ${request.originalUrl} requestId=${requestId}`,
        exception,
      );

    response
      .status(status)
      .json({
        statusCode: status,
        message,
        requestId,
        timestamp: new Date().toISOString(),
        path: request.originalUrl,
      });
  }
}
