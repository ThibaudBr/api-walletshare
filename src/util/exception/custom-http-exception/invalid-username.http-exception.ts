import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUsernameHttpException extends HttpException {
  constructor() {
    super('Invalid username exception', HttpStatus.BAD_REQUEST);
  }
}
