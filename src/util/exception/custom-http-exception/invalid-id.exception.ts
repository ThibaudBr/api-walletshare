import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIdException extends HttpException {
  constructor(message?: string) {
    super('Invalid Id' + message, HttpStatus.BAD_REQUEST);
  }
}
