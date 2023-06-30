import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUsernameHttpException extends HttpException {
  constructor(username?: string) {
    super('Invalid username exception' + username ?? '', HttpStatus.BAD_REQUEST);
  }
}
