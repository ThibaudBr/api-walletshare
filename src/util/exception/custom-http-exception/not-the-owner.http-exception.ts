import { HttpException, HttpStatus } from '@nestjs/common';

export class NotTheOwnerHttpException extends HttpException {
  constructor() {
    super('Not the owner', HttpStatus.FORBIDDEN);
  }
}
