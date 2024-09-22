import { Tracer } from '../tracer';

describe('Tracer', () => {
  let tracer: Tracer;

  beforeEach(() => {
    tracer = new Tracer();
  });

  it('should run with trace id', () => {
    return new Promise((resolve) => {
      tracer.run({ id: '1' }, () => {
        expect(tracer.id).toBe('1');
        resolve(true);
      });
    });
  });
});
