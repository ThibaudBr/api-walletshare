import { RuntimeException } from '@nestjs/core/errors/exceptions';

export class NoUserTraceException extends RuntimeException {
  constructor() {
    super(`Invalid parameter: No user trace provided`);
  }
}
