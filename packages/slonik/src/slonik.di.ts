import { Inject } from '@nestjs/common';

export const DI = {
  SLONIK_POOL: Symbol('SLONIK_POOL'),
};

export const InjectPool = () => Inject(DI.SLONIK_POOL);
