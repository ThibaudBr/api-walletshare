import { HttpException, HttpStatus } from '@nestjs/common';

export class SamePasswordHttpException extends HttpException {
  constructor() {
    super('New password is the same as old password', HttpStatus.BAD_REQUEST);
  }
}
