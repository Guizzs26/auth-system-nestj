/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    // Parse function throws ZodError if validation fails, which is caught by ZodExceptionFilter
    return this.schema.parse(value);
  }
}
