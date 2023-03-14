import { Injectable, NestMiddleware } from '@nestjs/common';
import * as useragent from 'useragent';
import { Request, Response } from 'express';
import { CreateLogDto } from '../api/api-log/domain/dto/create-log.dto';
import { ApiTypeEnum } from '../api/api-log/domain/enum/api-type.enum';
import { ApiLogService } from '../api/api-log/api-log.service';
import { LoggingTypeEnum } from '../api/api-log/domain/enum/logging-type.enum';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly API_NAME: string;
  private readonly API_VERSION: string;
  private readonly API_TYPE: ApiTypeEnum = ApiTypeEnum.WALLET_SHARE_API;
  private readonly VERBOSE: boolean;
  constructor(private readonly apiLoggerService: ApiLogService) {
    this.API_NAME = process.env.API_NAME || 'NO-NAME';
    this.API_VERSION = process.env.API_VERSION || 'NO-VERSION';
    this.VERBOSE = process.env.VERBOSE === 'true';
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  use(req: Request, res: Response, next: Function): void {
    const ua = useragent.parse(req.headers['user-agent']);

    const os = ua.os.toString();
    const device = ua.device.toString();
    const screenSize = req.headers['screen-size'] === undefined ? undefined : req.headers['screen-size'].toString();

    const createLogDto = new CreateLogDto();
    createLogDto.apiName = this.API_NAME;
    createLogDto.apiVersion = this.API_VERSION;
    createLogDto.loggingType = LoggingTypeEnum.REQUEST;
    createLogDto.apiType = ApiTypeEnum.WALLET_SHARE_API;
    createLogDto.method = req.method;
    createLogDto.route = req.baseUrl;
    createLogDto.headers = this.VERBOSE ? req.headers : undefined;
    createLogDto.body = this.VERBOSE ? req.body : undefined;
    createLogDto.platform = device;
    createLogDto.os = os;
    createLogDto.ip = req.ip;
    createLogDto.platform = req.headers['user-agent']
      ? req?.headers['user-agent']?.split('(')[1]?.split(')')[0]?.split('; ')[1]
      : undefined;
    createLogDto.screenSize = screenSize;

    this.apiLoggerService.createLog(createLogDto);

    next();
  }
}
