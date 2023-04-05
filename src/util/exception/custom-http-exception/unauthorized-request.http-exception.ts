import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedRequestHttpException extends HttpException {
  constructor() {
    super('Unauthorized request', HttpStatus.UNAUTHORIZED);
  }
}
