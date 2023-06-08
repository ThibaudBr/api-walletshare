import { Injectable, NestMiddleware } from '@nestjs/common';
import * as useragent from 'useragent';
import { Request, Response } from 'express';
import { CreateLogDto } from '../api/api-log/domain/dto/create-log.dto';
import { ApiLogService } from '../api/api-log/application/api-log.service';
import { VerboseLogEnum } from '../api/api-log/domain/enum/verbose-log.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResponseLoggingMiddleware implements NestMiddleware {
  private readonly VERBOSE: VerboseLogEnum;
  private readonly LOG_RESPONSE_BOOL: boolean;

  constructor(private readonly apiLoggerService: ApiLogService, private readonly configService: ConfigService) {
    this.VERBOSE = this.configService.get('VERBOSE') as VerboseLogEnum;
    this.LOG_RESPONSE_BOOL = this.configService.get('LOG_RESPONSE_BOOL') ?? false;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  async use(req: Request, res: Response, next: Function): Promise<void> {
    await next();
    if (this.LOG_RESPONSE_BOOL) {
      const ua = useragent.parse(req.headers['user-agent']);

      const os = ua.os.toString();
      const device = ua.device.toString();
      const screenSize = req.headers['screen-size'] === undefined ? undefined : req.headers['screen-size'].toString();

      const createLogDto = new CreateLogDto({});
      createLogDto.method = req.method;
      createLogDto.route = req.baseUrl;
      createLogDto.headers = req.headers || undefined;
      createLogDto.body = undefined;
      createLogDto.status = res.statusCode;
      createLogDto.responseHeaders = res.getHeaders();
      createLogDto.responseBody = res.locals.responseBody;
      createLogDto.error = undefined;
      createLogDto.os = os;
      createLogDto.ip = req.ip;
      createLogDto.platform = device;
      createLogDto.screenSize = screenSize;

      await this.apiLoggerService.createLog(createLogDto);
    }
  }
}
