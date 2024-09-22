import { Inject } from '@nestjs/common';

export const DI = {
  TRACER: Symbol('TRACER'),
};

export const InjectTracer = () => Inject(DI.TRACER);
