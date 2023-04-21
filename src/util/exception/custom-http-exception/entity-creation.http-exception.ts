import { HttpException } from '@nestjs/common';

export class EntityCreationHttpException extends HttpException {
  constructor() {
    super('Entity not created', 400);
  }
}
