import { ValidationError } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

type ConstraintMap = Record<string, string>;

export class InvalidParameterEntityException extends HttpException {
  constructor(errors: ValidationError[]) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        message:
          'Invalid parameters: ' +
          errors.map((error: ValidationError) => {
            const constraints = error.constraints as ConstraintMap;
            return Object.keys(constraints).map(key => {
              return constraints[key] || '';
            });
          }),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
