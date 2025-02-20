import { HttpException } from '@nestjs/common';

export interface HttpErrorResponse extends HttpException {
  title: string;
  detail: string;
  errors?: { message: string }[];
}
