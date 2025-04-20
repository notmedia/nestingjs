# @nestingjs/slonik

[Slonik](https://github.com/gajus/slonik) for Nest.js.

# Installation

```bash
npm i @nestingjs/slonik
```

# Usage

Import `SlonikModule` using either the `forRoot` or `forRootAsync` method in your application module.

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
      }),
    }),
  ],
})
export class AppModule {}
```

You can inject the pool in any injectable class using the `InjectPool` decorator.

```ts
import { InjectPool } from '@nestingjs/slonik';
import { Controller, Get, Query } from '@nestjs/common';
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
