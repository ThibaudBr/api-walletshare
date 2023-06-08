import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ErrorCustomEvent } from './error-custom.event';
import { CreateLogDto } from '../../../api/api-log/domain/dto/create-log.dto';
import { LoggingTypeEnum } from '../../../api/api-log/domain/enum/logging-type.enum';
import { ApiLogService } from '../../../api/api-log/application/api-log.service';
import { ApiTypeEnum } from '../../../api/api-log/domain/enum/api-type.enum';
import { ConfigService } from '@nestjs/config';

@EventsHandler(ErrorCustomEvent)
export class ErrorCustomEventHandler implements IEventHandler<ErrorCustomEvent> {
  private readonly API_NAME: string;
  private readonly npm_package_version: string;
  private readonly API_TYPE: ApiTypeEnum = ApiTypeEnum.WALLET_SHARE_API;

  constructor(private readonly apiLoggerService: ApiLogService, private readonly configService: ConfigService) {
    this.API_NAME = this.configService.get('API_NAME') ?? 'NO-NAME';
    this.npm_package_version = process.env.npm_package_version ?? 'NO-VERSION';
  }

  async handle(event: ErrorCustomEvent): Promise<void> {
    const createLogDto = new CreateLogDto({});
    createLogDto.apiName = this.API_NAME;
    createLogDto.apiVersion = this.npm_package_version;
    createLogDto.loggingType = LoggingTypeEnum.ERROR;
    createLogDto.apiType = this.API_TYPE;
    createLogDto.method = event.localisation;
    createLogDto.route = event.handler;
    createLogDto.error = event.error;

    await this.apiLoggerService.createLog(createLogDto);
  }
}
