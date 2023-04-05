import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidMailHttpException extends HttpException {
  constructor() {
    super('Mail is not valid', HttpStatus.BAD_REQUEST);
  }
}
