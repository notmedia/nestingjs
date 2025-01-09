import { LoggerModule } from '@nestingjs/logger';
import { InjectTracer, Tracer, TracerExpressMiddleware, TracerModule } from '@nestingjs/tracer';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    TracerModule.forRoot({}),
    LoggerModule.forRoot({
      level: 'verbose',
      transport: {
        target: '@nestingjs/logger-pretty',
      },
    }),
  ],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(@InjectTracer() private readonly tracer: Tracer) {
    this.tracer.enterWith({ id: '471abc61-87a5-4944-a270-841b29fe0bd3' });
    const err = new Error('test');

    this.logger.log({ key: 'value' }, 1, 'test', false, false);
    this.logger.log(false, true);
    this.logger.log(err, err.stack, { a: 1 }, { b: 2 });
    this.logger.verbose(err, err.stack);

    this.logger.error(err, { a: 1 });
    this.logger.error('test', { a: 1 });
    this.logger.error('err', '123');
    this.logger.error({ a: '1' }, '4', '2', '1', '0');
    this.logger.verbose(err);
    this.logger.debug(err);
    this.logger.log(0, '1', '2', '3');
    this.logger.error(err, err.stack);
    this.logger.error('abc', err, 'co');
    this.logger.warn(err);
    this.logger.fatal({ a: 1 }, err);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TracerExpressMiddleware).forRoutes('*');
  }
}
