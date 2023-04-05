import { HttpException } from '@nestjs/common';

export class EntityCreationException extends HttpException {
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
