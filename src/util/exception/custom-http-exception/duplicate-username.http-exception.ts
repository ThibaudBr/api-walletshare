import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateUsernameHttpException extends HttpException {
  constructor() {
    super('Username already exists', HttpStatus.BAD_REQUEST);
  }
}
