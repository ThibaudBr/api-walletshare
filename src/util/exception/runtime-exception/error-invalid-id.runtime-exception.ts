import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorInvalidIdRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
