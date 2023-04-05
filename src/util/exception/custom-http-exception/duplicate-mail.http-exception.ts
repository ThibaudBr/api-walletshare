import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateMailException extends HttpException {
  constructor() {
    super('Mail already exists', HttpStatus.BAD_REQUEST);
  }
}
