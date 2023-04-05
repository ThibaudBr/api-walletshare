import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundHttpException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.BAD_REQUEST);
  }
}
