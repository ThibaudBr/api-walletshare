import { HttpException } from '@nestjs/common';

export class CommandErrorHttpException extends HttpException {
  constructor() {
    super(
      {
        status: 500,
        message: 'Command execution failed',
      },
      500,
    );
  }
}
