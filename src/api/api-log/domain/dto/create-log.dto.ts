import { ApiProperty } from '@nestjs/swagger';
import { ApiTypeEnum } from '../enum/api-type.enum';
import { LoggingTypeEnum } from '../enum/logging-type.enum';

export class CreateLogDto {
  @ApiProperty()
  apiName: string;
  @ApiProperty()
  loggingType: LoggingTypeEnum;
  @ApiProperty()
  apiVersion: string;
  @ApiProperty({ enum: ApiTypeEnum })
  apiType: ApiTypeEnum;
  @ApiProperty()
  method?: string;
  @ApiProperty()
  route?: string;
  @ApiProperty({ type: 'json', nullable: true })
  headers?: object;
  @ApiProperty({ type: 'json', nullable: true })
  body?: object;
  @ApiProperty()
  module?: string;
  @ApiProperty({ nullable: true })
  status?: number;
  @ApiProperty({ type: 'json', nullable: true })
  responseHeaders?: object;
  @ApiProperty({ type: 'json', nullable: true })
  responseBody?: object;
  @ApiProperty({ type: 'text', nullable: true })
  error?: string;
  @ApiProperty({ nullable: true })
  os?: string;
  @ApiProperty({ nullable: true })
  platform?: string;
  @ApiProperty({ nullable: true })
  screenSize?: string;
  @ApiProperty({ nullable: true })
  ip?: string;

  constructor(partial: Partial<CreateLogDto>) {
    Object.assign(this, partial);
  }
}
