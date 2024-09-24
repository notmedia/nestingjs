import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

import { Tracer } from '../tracer';
import { InjectTracer } from '../tracer.di';

@Injectable()
export class TracerExpressMiddleware implements NestMiddleware {
  constructor(@InjectTracer() private readonly tracer: Tracer) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const id = (req.headers['x-request-id'] as string) || v4();

    req.headers['x-request-id'] = id;

    this.tracer.run({ id }, next);
  }
}
