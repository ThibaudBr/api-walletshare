import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CreateLogDto } from '../api/api-log/domain/dto/create-log.dto';
import { ApiTypeEnum } from '../api/api-log/domain/enum/api-type.enum';
import { ApiLogService } from '../api/api-log/api-log.service';
import { LoggingTypeEnum } from '../api/api-log/domain/enum/logging-type.enum';
import * as useragent from 'useragent';

@Injectable()
export class ErrorLoggingMiddleware implements NestMiddleware {
  private readonly API_NAME: string;
  private readonly API_VERSION: string;
  private readonly API_TYPE: ApiTypeEnum = ApiTypeEnum.WALLET_SHARE_API;

  private readonly VERBOSE: boolean;
  constructor(private readonly apiLoggerService: ApiLogService) {
    this.API_NAME = process.env.API_NAME || 'NO-NAME';
    this.API_VERSION = process.env.API_VERSION || 'NO-VERSION';
    this.VERBOSE = process.env.VERBOSE_ERROR === 'true';
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await next();
    } catch (error) {
      const ua = useragent.parse(req.headers['user-agent']);

      const os = ua.os.toString();
      const device = ua.device.toString();

      const createLogDto = new CreateLogDto();
      createLogDto.apiName = this.API_NAME;
      createLogDto.apiVersion = this.API_VERSION;
      createLogDto.loggingType = LoggingTypeEnum.ERROR;
      createLogDto.apiType = this.API_TYPE;
      createLogDto.method = req.method;
      createLogDto.route = req.baseUrl;
      createLogDto.headers = this.VERBOSE ? req.headers : undefined;
      createLogDto.body = this.VERBOSE ? req.body : undefined;
      createLogDto.status = res.statusCode;
      createLogDto.responseHeaders = res.getHeaders();
      createLogDto.responseBody = res.locals.responseBody;
      createLogDto.error = error.message;
      createLogDto.os = os;
      createLogDto.ip = req.ip;
      createLogDto.platform = device;
      createLogDto.screenSize = undefined;

      this.apiLoggerService.createLog(createLogDto);
      throw error;
    }
  }
}
