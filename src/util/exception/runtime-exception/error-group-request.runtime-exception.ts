import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorUpdateRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
