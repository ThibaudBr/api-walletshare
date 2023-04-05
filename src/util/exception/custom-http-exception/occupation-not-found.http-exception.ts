import { HttpException } from '@nestjs/common';

export class OccupationNotFoundHttpException extends HttpException {
  constructor() {
    super('Occupation not found', 404);
  }
}
