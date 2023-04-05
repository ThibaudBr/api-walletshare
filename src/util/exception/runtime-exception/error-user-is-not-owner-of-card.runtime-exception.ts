import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorUserIsNotOwnerOfCardRuntimeException extends RuntimeException {
  constructor(userId: string, cardId: string) {
    super(`User ${userId} is not owner of card ${cardId}`);
  }
}
