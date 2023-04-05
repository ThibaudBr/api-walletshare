import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorDeleteRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
