import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorInvalidGroupNameRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
