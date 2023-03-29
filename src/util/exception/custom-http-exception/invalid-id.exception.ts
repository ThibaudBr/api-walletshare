import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIdException extends HttpException {
  constructor() {
    super('Invalid Id', HttpStatus.BAD_REQUEST);
  }
}
