import { HttpException } from '@nestjs/common';

export class EntityIsNotSoftDeletedHttpException extends HttpException {
  constructor(message?: string) {
    super('' + message, 400);
  }
}
