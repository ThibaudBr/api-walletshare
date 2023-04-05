import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordHttpException extends HttpException {
  constructor() {
    super(
      'Invalid password. Password must contain at least 4 characters, at least one uppercase letter, one lowercase letter and one number',
      HttpStatus.BAD_REQUEST,
    );
  }
}
