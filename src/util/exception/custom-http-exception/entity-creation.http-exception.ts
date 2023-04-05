import { HttpException } from '@nestjs/common';

export class EntityCreationHttpException extends HttpException {
  constructor() {
    super(
      {
        status: 500,
        message: 'Entity creation failed',
      },
      500,
    );
  }
}
