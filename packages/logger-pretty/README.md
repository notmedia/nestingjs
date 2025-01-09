# @nestingjs/logger-pretty

Pre-configuration of [pino-pretty](https://github.com/pinojs/pino-pretty#handling-non-serializable-options) for [@nestingjs/logger](https://github.com/notmedia/nestingjs/tree/master/packages/logger).

# Installation

```bash
npm i @nestingjs/logger-pretty
```

# Usage

> [!IMPORTANT]\
> It is recommended to use prettifier **only** in **development** due to performance reasons.

```ts
@Module({
  imports: [
    LoggerModule.forRoot({
      transport: {
        target: '@nestingjs/logger-pretty',
        // Customize prettifier options if needed
        options: {
          traceKey: 'trace_id',
          translateTime: 'UTC:mm.dd.yyyy, h:MM:ss TT Z',
        },
      },
    }),
  ],
})
export class AppModule {}
```

# Options

`PinoPrettyOptions` extends the `PrettyOptions` [pino-pretty](https://github.com/pinojs/pino-pretty#handling-non-serializable-options).

```ts
export type PinoPrettyOptions = PrettyOptions & {
  /**
   * The string key for the Error in the JSON object.
   * @default err
   */
  errorKey?: string;

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
};
```
