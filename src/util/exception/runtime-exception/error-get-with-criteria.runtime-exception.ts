import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorGetWithCriteriaRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
