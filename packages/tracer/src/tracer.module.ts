import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from 'tracer.module-definition';

import { TracerProvider } from './tracer.provider';

@Module({
  providers: [TracerProvider],
  exports: [TracerProvider],
})
export class TracerModude extends ConfigurableModuleClass {}
