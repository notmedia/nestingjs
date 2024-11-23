import { Tracer } from '../tracer';

describe('Tracer', () => {
  type CustomTracerData = {
    user?: string;
  };

  let tracer: Tracer<CustomTracerData>;

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

  it('should run with custom tracer data', () => {
    return new Promise((resolve) => {
      const data = { id: '1', user: '2' };

      tracer.run(data, () => {
        expect(tracer.id).toBe('1');
        expect(tracer.data).toStrictEqual(data);
        resolve(true);
      });
    });
  });
});
