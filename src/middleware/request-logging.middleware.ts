import { Injectable, NestMiddleware } from '@nestjs/common';
import * as useragent from 'useragent';
import { Request, Response } from 'express';
import { CreateLogDto } from '../api/api-log/domain/dto/create-log.dto';
import { ApiTypeEnum } from '../api/api-log/domain/enum/api-type.enum';
import { ApiLogService } from '../api/api-log/application/api-log.service';
import { LoggingTypeEnum } from '../api/api-log/domain/enum/logging-type.enum';
import { VerboseLogEnum } from '../api/api-log/domain/enum/verbose-log.enum';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly VERBOSE: VerboseLogEnum;
  constructor(private readonly apiLoggerService: ApiLogService) {
    this.VERBOSE = (process.env.VERBOSE as VerboseLogEnum) || VerboseLogEnum.NONE;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  use(req: Request, res: Response, next: Function): void {
    const ua = useragent.parse(req.headers['user-agent']);

    const os = ua.os.toString();
    const device = ua.device.toString();
    const screenSize = req.headers['screen-size'] === undefined ? undefined : req.headers['screen-size'].toString();

    const createLogDto = new CreateLogDto({});
    createLogDto.loggingType = LoggingTypeEnum.REQUEST;
    createLogDto.apiType = ApiTypeEnum.WALLET_SHARE_API;
    createLogDto.method = req.method;
    createLogDto.route = req.baseUrl;
    createLogDto.headers = req.headers || undefined;
    createLogDto.body = this.VERBOSE == VerboseLogEnum.DEBUG ? req.body : undefined;
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
