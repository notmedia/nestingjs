# @nestingjs/logger

Logger for Nest.js built on top of [`pino`](https://github.com/pinojs/pino).


# Installation

```bash
npm i @nestingjs/logger
```

# Levels

This module has pre-defined levels for Nest.js.

```ts
customLevels: {
  verbose: 10,
  debug: 20,
  log: 30,
  warn: 40,
  error: 50,
  fatal: 60,
},
```

# Usage

Import `LoggerModule` with `forRoot` or `forRootAsync` methods where you want to use logger.

```ts
import { LoggerModule } from '@nestingjs/logger';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    LoggerModule.forRoot({
      level: 'verbose',
    }),
  ],
})
export class AppModule {}
```

## Options

`LoggerModuleOptions` extends the `pino.LoggerOptions` except 'customLevels' and 'useOnlyCustomLevels'

```ts
export type LoggerModuleOptions = {
  /**
   * One of the supported levels ["verbose", "debug", "log", "warn", "error", "fatal"]
   * @default log
   */
  level?: LogLevel;
  /**
   * The string key for the Context in the JSON object.
   * @default context
   */
  contextKey?: string;

  /**
   * The string key for the Tracing ID in the JSON object.
   * @default trace
   */
  traceKey?: string;
} & Omit<pino.LoggerOptions<LogLevel, true>, 'customLevels' | 'useOnlyCustomLevels'>;
```

In bootstrap function use logger.

> [!NOTE]\
> Read about bufferLogs [here](https://docs.nestjs.com/techniques/logger)

```ts
import { LoggerService } from '@nestingjs/logger';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  ...

  await app.listen(8080);
}

void bootstrap();
```

In any Injectable use logger from `@nestjs/common`. Under the hood it will log all messages using this logger.

```ts
import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class AppHttpController {
  // This is the recomended way to use Logger by Nest.js
  private readonly logger = new Logger(AppHttpController.name);

  @Get('/')
  get() {
    this.logger.log('handled HTTP get route');
  }
}
```

## Pretty print

You can use [@nestingjs/logger-pretty](https://github.com/notmedia/nestingjs/tree/master/packages/logger-pretty) for pretty printing or use [pino-pretty](https://github.com/pinojs/pino-pretty) as your own.

## Tracing

This logger has support tracing via [@nestingjs/tracer](https://github.com/notmedia/nestingjs/tree/master/packages/tracer)
