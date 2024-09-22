import { Provider } from '@nestjs/common';

import { Tracer } from './tracer';
import { DI } from './tracer.di';

export const TracerProvider: Provider = {
  provide: DI.TRACER,
  useClass: Tracer,
};
