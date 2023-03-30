import { HttpException, HttpStatus } from '@nestjs/common';

export class NotTheOwnerException extends HttpException {
  constructor() {
    super('Not the owner', HttpStatus.FORBIDDEN);
  }
}
