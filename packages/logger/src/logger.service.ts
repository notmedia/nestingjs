import { InjectTracer, Tracer } from '@nestingjs/tracer';
import {
  Inject,
  Injectable,
  LoggerService as NestLoggerService,
  LogLevel,
  Optional,
} from '@nestjs/common';
import pino from 'pino';

import { LoggerModuleOptions, MODULE_OPTIONS_TOKEN } from './logger.module-definition';

type Message = string | number | boolean | Record<string, unknown> | Error;

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: pino.Logger<LogLevel, true>;

  private messageKey: string;
  private errorKey: string;
  private traceKey: string;
  private contextKey: string;

  constructor(
    @Optional() @Inject(MODULE_OPTIONS_TOKEN) options?: LoggerModuleOptions,
    @Optional() @InjectTracer() private readonly tracer?: Tracer
  ) {
    this.messageKey = options?.messageKey ?? 'msg';
    this.contextKey = options?.contextKey ?? 'context';
    this.errorKey = options?.errorKey ?? 'err';
    this.traceKey = options?.traceKey ?? 'trace';

    this.logger = pino<LogLevel, true>({
      customLevels: {
        verbose: 10,
        debug: 20,
        log: 30,
        warn: 40,
        error: 50,
        fatal: 60,
      },
      useOnlyCustomLevels: true,
      level: 'log',
      timestamp: pino.stdTimeFunctions.isoTime,
      ...options,
    });
  }

  verbose(message: Message, context?: string): void;
  verbose(message: Message, ...optionalParams: [...(Message[] | []), string?]): void;
  verbose(message: Message, ...optionalParams: unknown[]) {
    const { messages, context } = this.getContextAndMessages([message, ...optionalParams]);

    messages.forEach((value) => {
      this.logger.verbose({
        ...value,
        [this.contextKey]: context,
        [this.traceKey]: this.tracer?.id,
      });
    });
  }

  debug(message: Message, context?: string): void;
  debug(message: Message, ...optionalParams: [...(Message[] | []), string?]): void;
  debug(message: Message, ...optionalParams: unknown[]): void {
    const { messages, context } = this.getContextAndMessages([message, ...optionalParams]);

    messages.forEach((value) => {
      this.logger.debug({
        ...value,
        [this.contextKey]: context,
        [this.traceKey]: this.tracer?.id,
      });
    });
  }

  log(message: Message, context?: string): void;
  log(message: Message, ...optionalParams: [...(Message[] | []), string?]): void;
  log(message: Message, ...optionalParams: unknown[]): void {
    const { messages, context } = this.getContextAndMessages([message, ...optionalParams]);

    messages.forEach((value) => {
      this.logger.log({
        ...value,
        [this.contextKey]: context,
        [this.traceKey]: this.tracer?.id,
      });
    });
  }

  warn(message: Message, context?: string): void;
  warn(message: Message, ...optionalParams: [...(Message[] | []), string?]): void;
  warn(message: Message, ...optionalParams: unknown[]): void {
    const { messages, context } = this.getContextAndMessages([message, ...optionalParams]);

    messages.forEach((value) => {
      this.logger.warn({
        ...value,
        [this.contextKey]: context,
        [this.traceKey]: this.tracer?.id,
      });
    });
  }

  error(message: Message, stackOrContext?: string): void;
  error(message: Message, stack?: string): void;
  error(message: Message, context?: string): void;
  error(message: Message, stack?: string, context?: string): void;
  error(message: Message, ...optionalParams: [...(Message[] | []), string?]): void;
  error(message: Message, ...optionalParams: unknown[]): void {
    const { messages, context } = this.getContextAndErrorMessages([message, ...optionalParams]);

    messages.forEach((value) => {
      this.logger.error({
        ...value,
        [this.contextKey]: context,
        [this.traceKey]: this.tracer?.id,
      });
    });
  }

  fatal(message: Message, context?: string): void;
  fatal(message: Message, ...optionalParams: [...(Message[] | []), string?]): void;
  fatal(message: Message, ...optionalParams: unknown[]): void {
    const { messages, context } = this.getContextAndMessages([message, ...optionalParams]);

    messages.forEach((value) => {
      this.logger.fatal({
        ...value,
        [this.contextKey]: context,
        [this.traceKey]: this.tracer?.id,
      });
    });
  }

  private getContextAndMessages(args: unknown[]) {
    const context = args[args.length - 1];

    const isContext = args.length > 1 && typeof context === 'string';

    return {
      context: isContext ? context : undefined,
      messages: (args.slice(0, isContext ? args.length - 1 : args.length) as Message[]).reduce(
        (acc, message) => {
          if (message instanceof Error) {
            acc.push({
              [this.errorKey]: message,
            });
          } else if (typeof message === 'object') {
            acc.push(message);
          } else if (message !== undefined) {
            acc.push({
              [this.messageKey]: message,
            });
          }

          return acc;
        },
        [] as Record<string, unknown>[]
      ),
    };
  }

  private getMesssageFromErrorMessage(message: Record<string, unknown>) {
    if (typeof message[this.errorKey] === 'object') {
      return (message[this.errorKey] as Record<string, unknown>)?.message as string;
    }

    return message[this.messageKey];
  }

  private getContextAndErrorMessages(args: unknown[]) {
    // eslint-disable-next-line prefer-const
    let { messages, context } = this.getContextAndMessages(args);

    if (messages.length !== 1) {
      const stack = messages[messages.length - 1];

      if (typeof stack[this.messageKey] === 'string') {
        messages = messages.slice(0, messages.length - 1);

        messages[messages.length - 1] = {
          [this.errorKey]: {
            stack: stack[this.messageKey] as string,
            message: this.getMesssageFromErrorMessage(messages[messages.length - 1]) as string,
          },
        };
      }
    }

    return { messages, context };
  }
}
