import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorParameterNotProvidedRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
