import { HttpException } from '@nestjs/common';

export class QueryErrorException extends HttpException {
  constructor() {
    super('Query Error', 500);
  }
}
