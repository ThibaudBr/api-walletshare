import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RequestRaw } from 'express-serve-static-core';
import * as getRawBody from 'raw-body';

declare module 'express-serve-static-core' {
  export interface RequestRaw extends Request {
    rawBody: string | undefined;
  }
}

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  async use(req: RequestRaw, res: Response, next: NextFunction): Promise<void> {
    req.rawBody = await getRawBody(req, {
      encoding: 'utf8',
    });
    next();
  }
}
