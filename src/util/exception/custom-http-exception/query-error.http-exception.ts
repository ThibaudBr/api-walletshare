import { HttpException } from '@nestjs/common';

export class QueryErrorHttpException extends HttpException {
  constructor() {
    super('Query Error', 500);
  }
}
