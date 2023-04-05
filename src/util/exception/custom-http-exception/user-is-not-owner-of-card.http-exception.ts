import { HttpException, HttpStatus } from '@nestjs/common';

export class UserIsNotOwnerOfCardHttpException extends HttpException {
  constructor(message?: string) {
    super('User is not owner of card' + message, HttpStatus.BAD_REQUEST);
  }
}
