import { HttpException } from '@nestjs/common';

export class OccupationNotFoundException extends HttpException {
  constructor() {
    super('Occupation not found', 404);
  }
}
