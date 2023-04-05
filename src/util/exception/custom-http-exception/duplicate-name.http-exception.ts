import { HttpException } from '@nestjs/common';

export class DuplicateNameHttpException extends HttpException {
  constructor() {
    super('Duplicate name', 409);
  }
}
