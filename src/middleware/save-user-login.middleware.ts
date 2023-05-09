import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as useragent from 'useragent';
import { UserService } from '../api/user/application/user.service';
import { SaveUserLoginDto } from '../api/user/domain/dto/save-user-login.dto';

@Injectable()
export class SaveUserLoginMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  async use(req: Request, res: Response, next: Function): Promise<void> {
    await next();

    const ua = useragent.parse(req.headers['user-agent']) || undefined;
    const platform: string | undefined = req.headers['user-agent']
      ? req?.headers['user-agent']?.split('(')[1]?.split(')')[0]?.split('; ')[1]
      : undefined;
    const os = ua.os.toString() || undefined;
    const device = ua.device.toString() || undefined;
    const userId: string = res.locals.userId;

    const saveUserLogin: SaveUserLoginDto = new SaveUserLoginDto({
      userId: userId,
      os: os,
      device: device,
      ip: req.ip,
      platform: platform,
    });

    await this.userService.saveUserLogin(saveUserLogin);
  }
}
