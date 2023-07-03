import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer | undefined;
}

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: RequestWithRawBody, res: Response, next: NextFunction): void {
    return json({
      verify: (request: RequestWithRawBody, response: Response, buffer: Buffer) => {
        console.log('buffer', buffer);
        request.rawBody = Buffer.from(buffer);
        return true;
      },
    })(req, res, next);
  }
}
