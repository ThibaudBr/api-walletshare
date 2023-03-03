import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateUsernameException extends HttpException {
  constructor() {
    super('Username already exists', HttpStatus.BAD_REQUEST);
  }
}
