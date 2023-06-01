import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class IsTestEnvironmentPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: never, metadata: ArgumentMetadata): never {
    if (this.configService.get('NODE_ENV') === 'test') {
      return value;
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
