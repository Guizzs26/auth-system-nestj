import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyInUseException extends HttpException {
  constructor(message?: string) {
    super(
      {
        title: 'Email already in use',
        detail: message || 'This email is already registered for another user.',
        status: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  }
}
