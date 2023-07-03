import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RequestRaw } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
  export interface RequestRaw extends Request {
    rawBody: Buffer | undefined;
  }
}

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: RequestRaw, res: Response, next: NextFunction) {
    req.rawBody = Buffer.from('');
    req.setEncoding('utf8');

    req.on('data', function (chunk) {
      req.rawBody += chunk;
    });

    req.on('end', function () {
      next();
    });
  }
}
