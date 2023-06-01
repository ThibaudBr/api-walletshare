import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';

export class IsTestEnvironmentPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: never, metadata: ArgumentMetadata): never {
    if (process.env.NODE_ENV === 'test') {
      return value;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
