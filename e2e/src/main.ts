import { LoggerService } from '@nestingjs/logger';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  logger.verbose('verbose');
  logger.verbose({}, 'Test');
  logger.debug('debug');
  logger.log('log');
  logger.warn('warn');
  logger.error('error');
  logger.fatal('fatal');

  logger.error(new Error());
  logger.error('');

  logger.log({ test: 1 });

  await app.listen(8080);
}

void bootstrap();
