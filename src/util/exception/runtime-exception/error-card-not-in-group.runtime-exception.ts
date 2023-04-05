import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorCardNotInGroupRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
