import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorCardAlreadyConnectedRuntimeException extends RuntimeException {
  constructor(message: string) {
    super(message);
  }
}
