import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUsernameException extends HttpException {
  constructor() {
    super('Invalid mail exception', HttpStatus.BAD_REQUEST);
  }
}
