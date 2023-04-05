import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorRestoreRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
