import { HttpException, HttpStatus } from '@nestjs/common';

export class MailRequiredException extends HttpException {
  constructor() {
    super('Mail is required', HttpStatus.BAD_REQUEST);
  }
}
