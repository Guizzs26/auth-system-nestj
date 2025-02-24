import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { Response } from 'express';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  public catch(exception: ZodError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;
    const errors = exception.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      title: 'Validation error',
      detail:
        errors.length > 0 ? 'Validation failed' : 'Unknown validation error',
      errors,
      status,
    });
  }
}
