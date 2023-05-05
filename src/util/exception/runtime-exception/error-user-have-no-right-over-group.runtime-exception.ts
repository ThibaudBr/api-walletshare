import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class ErrorUserHaveNoRightOverGroupRuntimeException extends RuntimeException {
  constructor(userId: string, groupId: string, message?: string) {
    super(`User ${userId} have no right over group ${groupId}` + message);
  }
}
