import { HttpException } from '@nestjs/common';

export class DuplicateNameException extends HttpException {
  constructor() {
    super('Duplicate name', 409);
  }
}
