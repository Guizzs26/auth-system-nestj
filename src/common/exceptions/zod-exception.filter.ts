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
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;
    const errors = exception.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    response.status(status).json({
      statusCode: status,
      message:
        errors.length > 0 ? 'Validation failed' : 'Unknown validation error',
      errors,
    });
  }
}
