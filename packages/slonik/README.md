# @nestingjs/slonik

[Slonik](https://github.com/gajus/slonik) for Nest.js.

# Installation

```bash
npm i @nestingjs/slonik
```

# Usage

Import `SlonikModule` using either the `forRoot` or `forRootAsync` method in your application module.

```ts
import { SlonikModule } from '@nestingjs/slonik';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    SlonikModule.forRootAsync({
      useFactory: () => ({
        connectionUri: 'postgresql://user:password@host:port/database?param=value',
        minimumPoolSize: 0,
        maximumPoolSize: 15,
      }),
    }),
  ],
})
export class AppModule {}
```

You can inject the pool in any injectable class using the `InjectPool` decorator.

```ts
import { InjectPool } from '@nestingjs/slonik';
import { Controller, Get } from '@nestjs/common';
import { DatabasePool, createSqlTag } from 'slonik';
import { z } from 'zod';

@Controller()
export class AppHttpController {
  private readonly sql = createSqlTag({
    typeAliases: {
      id: z.object({
        id: z.number(),
      }),
    },
  });

  constructor(
    @InjectPool() private readonly pool: DatabasePool
  ) {}

  @Get('/')
  get() {
    return this.pool.query(this.sql.typeAlias('id')`SELECT 1 AS id`);
  }
}
```

## Options

`SlonikModuleOptions` extends the `ClientConfigurationInput` from Slonik.

```ts
export type SlonikModuleOptions = {
  /**
   * PostgreSQL [Connection URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
   */
  connectionUri: string;
} & ClientConfigurationInput;
```

## Interceptors

This package includes some useful interceptors out of the box.

### Usage

```ts
import { SlonikInterceptors, SlonikModule } from '@nestingjs/slonik';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    SlonikModule.forRootAsync({
      useFactory: () => ({
        connectionUri: 'postgresql://user:password@host:port/database?param=value',
        minimumPoolSize: 0,
        maximumPoolSize: 15,
        interceptors: [
          SlonikInterceptors.withLogger(logger),
          SlonikInterceptors.withTimezone('Asia/Dubai'),
        ],
      }),
    }),
  ],
  controllers: [],
})
export class AppModule {}
```

### WithTimezone

Sets time zone for each connection.

```ts
/**
 * Creates an interceptor that sets the time zone for each DB session.
 *
 * @param {string} [timezone] - A valid IANA time zone name recognized by PostgreSQL.
 * Example values: 'UTC', 'America/New_York', 'Asia/Dubai'.
 */
SlonikInterceptors.withTimezone(timezone: string): Interceptor
```

```ts
SlonikModule.forRootAsync({
  inject: [],
  useFactory: () => ({
    connectionUri: 'postgresql://user:password@host:port/database?param=value',
    minimumPoolSize: 0,
    maximumPoolSize: 15,
    interceptors: [SlonikInterceptors.withTimezone('Asia/Dubai')],
  }),
}),
```

### WithLogger
Adds a logger interceptor for logging SQL queries using `beforeTransformQuery` hook.

`SlonikInterceptors.withLogger(logger: LoggerService, options: LoggerInterceptorOptions): Interceptor`

```ts
export type LoggerInterceptorOptions = {
  /**
   * Message key where to write SQL query
   * @default msg
   */
  messageKey?: string;
};
```

> [!TIP]\
> This interceptor works seamlessly with [@nestingjs/logger](https://github.com/notmedia/nestingjs/tree/master/packages/logger).

```ts
SlonikModule.forRootAsync({
  inject: [LoggerService],
  useFactory: (logger: LoggerService) => ({
    connectionUri: 'postgresql://user:password@host:port/database?param=value',
    minimumPoolSize: 0,
    maximumPoolSize: 15,
    interceptors: [SlonikInterceptors.withLogger(logger)],
  }),
}),
```
