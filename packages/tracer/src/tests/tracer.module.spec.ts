import { Test } from '@nestjs/testing';

import { DI, Tracer, TracerModule } from '../index';

describe('TracerModule', () => {
  let tracer: Tracer;

  beforeEach(async () => {
    const ref = await Test.createTestingModule({
      imports: [TracerModule.forRoot({ isGlobal: true })],
    }).compile();

    tracer = ref.get<Tracer>(DI.TRACER);
  });

  it('should return trace id when called in async context', () => {
    return new Promise((resolve) => {
      tracer.run({ id: '1' }, () => {
        expect(tracer.id).toEqual('1');
        resolve(true);
      });
    });
  });

  it('should return undefined when call outside of async context ', () => {
    expect(tracer.id).toEqual(undefined);
  });
});
