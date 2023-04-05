import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorSaveRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
