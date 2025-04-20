import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './slonik.module-definition';
import { SlonikProvider } from './slonik.provider';

@Module({
  providers: [SlonikProvider],
  exports: [SlonikProvider],
})
export class SlonikModule extends ConfigurableModuleClass {}
