import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorSoftDeleteRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
