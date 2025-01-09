import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './logger.module-definition';
import { LoggerService } from './logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule extends ConfigurableModuleClass {}
