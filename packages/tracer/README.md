# @nestingjs/tracer

Tracer wraps incoming request using `AsyncLocalStorage` to hold or generate `x-request-id` using uuid v4 in context.

# Installation

```bash
npm i @nestingjs/tracer
```

# Usage

## TracerExpressMiddleware

Apply `TracerExpressMiddleware` on routes:

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TracerModule } from '@nestingjs/tracer';

@Module({
  imports: [
    TracerModule.forRoot({}),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TracerExpressMiddleware).forRoutes('*');
  }
}
```

## Injecting Tracer

```ts
import { Injectable } from '@nestjs/common';
import { InjectTracer, Tracer } from '@nestingjs/tracer';

@Injectable()
export class MyService {
  constructor(
    @InjectTracer() private readonly tracer: Tracer,
  ) {}

  customMethod(): string | undefiend {
    return this.tracer.id;
  }
}
```
