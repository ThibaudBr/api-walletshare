import { ValidationError } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidParameterEntityException extends HttpException {
  constructor(errors: ValidationError[]) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        message:
          'Invalid parameters : ' +
          errors.map((error: ValidationError) => {
            return Object.keys(error.constraints).map((key) => {
              return error.constraints[key];
            });
          }),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
