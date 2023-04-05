import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorCardAlreadyInGroupRuntimeException extends RuntimeException {
  constructor(groupId: string, cardId: string) {
    super(`Card ${cardId} is already in group ${groupId}`);
  }
}
