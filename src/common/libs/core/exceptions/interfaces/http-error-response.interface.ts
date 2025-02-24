import { HttpException } from '@nestjs/common';

export interface IHttpErrorResponse extends HttpException {
  title: string;
  detail: string;
  errors?: { message: string }[];
}
