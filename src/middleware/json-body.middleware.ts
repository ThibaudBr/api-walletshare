import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    bodyParser.json()(req, res, next);
  }
}
