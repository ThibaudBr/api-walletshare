import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CreateLogDto } from '../api/api-log/domain/dto/create-log.dto';
import { ApiLogService } from '../api/api-log/application/api-log.service';
import { LoggingTypeEnum } from '../api/api-log/domain/enum/logging-type.enum';
import * as useragent from 'useragent';
import { VerboseLogEnum } from '../api/api-log/domain/enum/verbose-log.enum';

@Injectable()
export class ErrorLoggingMiddleware implements NestMiddleware {
  private readonly VERBOSE: VerboseLogEnum;

  constructor(private readonly apiLoggerService: ApiLogService) {
    this.VERBOSE = process.env.VERBOSE as VerboseLogEnum;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      next();
    } catch (error) {
      const ua = useragent.parse(req.headers['user-agent']);

      const os = ua.os.toString();
      const device = ua.device.toString();

      const createLogDto = new CreateLogDto({});
      createLogDto.loggingType = LoggingTypeEnum.ERROR;
      createLogDto.method = req.method;
      createLogDto.route = req.baseUrl;
      createLogDto.headers = req.headers || undefined;
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
