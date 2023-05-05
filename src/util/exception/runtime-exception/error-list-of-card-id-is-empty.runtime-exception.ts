import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorListOfCardIdIsEmptyRuntimeException extends RuntimeException {
  constructor() {
    super('List of card ID is empty');
  }
}
