import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.raw({ type: '*/*' })(req, res, next);
  }
}
