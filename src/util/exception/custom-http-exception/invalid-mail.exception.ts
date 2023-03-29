import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidMailException extends HttpException {
  constructor() {
    super('Mail is not valid', HttpStatus.BAD_REQUEST);
  }
}
