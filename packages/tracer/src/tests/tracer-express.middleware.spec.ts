import { Request, Response } from 'express';

import { TracerExpressMiddleware } from '../middlewares';
import { Tracer } from '../tracer';

describe('TracerExpressMiddleware', () => {
  const tracer = new Tracer();
  const middleware = new TracerExpressMiddleware(tracer);

  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use with x-request-id', () => {
    const request = {
      headers: {
        'x-request-id': 'custom-request-id',
      },
    };

    next.mockImplementation(() => {
      expect(tracer.id).toEqual('custom-request-id');
      expect(request.headers['x-request-id']).toEqual('custom-request-id');
    });

    middleware.use(request as unknown as Request, {} as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(tracer.id).toEqual(undefined);
  });

  it('should use without x-request-id', () => {
    const request = {
      headers: {},
    };

    next.mockImplementationOnce(() => {
      expect(tracer.id).toBeTruthy();
      expect(request.headers['x-request-id']).toBeTruthy();
    });

    middleware.use(request as unknown as Request, {} as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(tracer.id).toEqual(undefined);
  });
});
