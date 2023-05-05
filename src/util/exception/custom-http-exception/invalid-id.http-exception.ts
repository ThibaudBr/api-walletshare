import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIdHttpException extends HttpException {
  constructor(message?: string) {
    if (message) message = ': ' + message;
    else message = '';
    super('Invalid Id' + message, HttpStatus.BAD_REQUEST);
  }
}
