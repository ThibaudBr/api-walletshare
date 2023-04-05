import { HttpException } from '@nestjs/common';

export class CommandErrorException extends HttpException {
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
