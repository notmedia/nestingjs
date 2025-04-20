import { Provider } from '@nestjs/common';
import { createPool } from 'slonik';

import { DI } from './slonik.di';
import { MODULE_OPTIONS_TOKEN, SlonikModuleOptions } from './slonik.module-definition';

export const SlonikProvider: Provider = {
  provide: DI.SLONIK_POOL,
  inject: [MODULE_OPTIONS_TOKEN],
  useFactory: ({ connectionUri, ...options }: SlonikModuleOptions) => {
    return createPool(connectionUri, {
      ...options,
    });
  },
};
