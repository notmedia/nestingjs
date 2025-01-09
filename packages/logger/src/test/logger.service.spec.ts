import { DI, Tracer, TracerModule } from '@nestingjs/tracer';
import { LogLevel } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { LoggerModule, LoggerModuleOptions, LoggerService } from '../index';

const PINO_MOCKS = {
  verbose: vi.fn(),
  debug: vi.fn(),
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
};

vi.mock('pino', () => {
  const mock = vi.fn(() => PINO_MOCKS);
  // @ts-expect-error mock
  mock.stdTimeFunctions = {
    isoTime: vi.fn().mockImplementation(() => ',"time":"2024-12-03T19:57:25.348Z"'),
  };

  return {
    default: mock,
  };
});

function setupTest(spy: () => void, options: LoggerModuleOptions, tracer?: Tracer) {
  const TRACE_ID_STUB = '471abc61-87a5-4944-a270-841b29fe0bd3';

  if (tracer) {
    tracer.enterWith({ id: TRACE_ID_STUB });
  }

  function toHaveBeenNthCalledWithCustomKeys(
    this: () => void,
    nth: number,
    args: Record<string, unknown>
  ) {
    const { msg, context, err, ...other } = args;

    expect(this).toHaveBeenNthCalledWith(nth, {
      [options.messageKey ?? 'msg']: msg,
      [options.contextKey ?? 'context']: context,
      [options.errorKey ?? 'err']: err,
      [options.traceKey ?? 'trace']: tracer ? TRACE_ID_STUB : undefined,
      ...other,
    });
  }

  return toHaveBeenNthCalledWithCustomKeys.bind(spy);
}

describe('LoggerService', () => {
  let logger: LoggerService;
  let tracer: Tracer;

  describe.each(
    [
      {
        name: 'Default',
        tracerEnabled: false,
      },
      {
        name: 'With Tracer',
        tracerEnabled: true,
      },
      {
        tracerEnabled: true,
        name: 'With overrided message/context/error/trace keys',
        messageKey: 'message',
        contextKey: 'ctx',
        errorKey: 'error',
        traceKey: 'trace_id',
      },
    ].map(({ name, ...options }) => [name, options])
  )('%s', (_, { tracerEnabled = false, ...options }) => {
    beforeEach(async () => {
      const modules = [
        LoggerModule.forRoot({
          level: 'verbose',
          ...options,
        }),
      ];

      if (tracerEnabled) {
        modules.push(TracerModule.forRoot({}));
      }

      const moduleRef = await Test.createTestingModule({
        imports: modules,
      }).compile();

      logger = moduleRef.get(LoggerService);

      if (tracerEnabled) {
        tracer = moduleRef.get(DI.TRACER);
      }
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    describe.each<LogLevel>(['verbose', 'debug', 'log', 'warn', 'error', 'fatal'])(
      '%s',
      (level) => {
        it('should log message without context', () => {
          const expectNthLog = setupTest(PINO_MOCKS[level], options, tracer);

          const error = new Error('Custom Error');

          logger[level]('message');
          logger[level](1);
          logger[level](false);
          logger[level]({ key: 'value' });
          logger[level](error);

          expect(PINO_MOCKS[level]).toHaveBeenCalledTimes(5);
          expectNthLog(1, { msg: 'message' });
          expectNthLog(2, { msg: 1 });
          expectNthLog(3, { msg: false });
          expectNthLog(4, { key: 'value' });
          expectNthLog(5, { err: error });
        });

        it('should log message with context', () => {
          const expectNthLog = setupTest(PINO_MOCKS[level], options, tracer);

          const error = new Error('Custom Error');

          logger[level]('message', 'context');
          logger[level](1, 'context');
          logger[level](false, 'context');
          logger[level]({ key: 'value' }, 'context');
          logger[level](error, 'context');

          expect(PINO_MOCKS[level]).toHaveBeenCalledTimes(5);
          expectNthLog(1, { msg: 'message', context: 'context' });
          expectNthLog(2, { msg: 1, context: 'context' });
          expectNthLog(3, { msg: false, context: 'context' });
          expectNthLog(4, { key: 'value', context: 'context' });
          expectNthLog(5, { err: error, context: 'context' });
        });

        it('should log multiple messages at one call', () => {
          const expectNthLog = setupTest(PINO_MOCKS[level], options, tracer);

          const error = new Error('Custom Error');
          logger[level]('message', 1, false, { key: 'value' }, error);

          expect(PINO_MOCKS[level]).toHaveBeenCalledTimes(5);
          expectNthLog(1, { msg: 'message' });
          expectNthLog(2, { msg: 1 });
          expectNthLog(3, { msg: false });
          expectNthLog(4, { key: 'value' });
          expectNthLog(5, { err: error });
        });

        it('should log multiple messages at one call with context', () => {
          const expectNthLog = setupTest(PINO_MOCKS[level], options, tracer);

          const error = new Error('Custom Error');
          logger[level]('message', 1, false, { key: 'value' }, error, 'context');

          expect(PINO_MOCKS[level]).toHaveBeenCalledTimes(5);
          expectNthLog(1, { msg: 'message', context: 'context' });
          expectNthLog(2, { msg: 1, context: 'context' });
          expectNthLog(3, { msg: false, context: 'context' });
          expectNthLog(4, { key: 'value', context: 'context' });
          expectNthLog(5, { err: error, context: 'context' });
        });
      }
    );

    describe.each<Omit<LogLevel, 'error'>>(['verbose', 'debug', 'log', 'warn', 'fatal'])(
      '%s',
      (level) => {
        it('should log multiple messages at one call with last 3 strings', () => {
          const expectNthLog = setupTest(PINO_MOCKS[level as LogLevel], options, tracer);

          logger[level as LogLevel](1, 2, '3', '4', '5', 'context');

          expect(PINO_MOCKS[level as LogLevel]).toHaveBeenCalledTimes(5);
          expectNthLog(1, { msg: 1, context: 'context' });
          expectNthLog(2, { msg: 2, context: 'context' });
          expectNthLog(3, { msg: '3', context: 'context' });
          expectNthLog(4, { msg: '4', context: 'context' });
          expectNthLog(5, { msg: '5', context: 'context' });
        });
      }
    );

    describe('error', () => {
      it('should log errors in nestjs way', () => {
        const expectNthLog = setupTest(PINO_MOCKS.error, options, tracer);

        const error = new Error('Custom Error');

        logger.error('error', 'stack', 'context');
        logger.error(1, 'text', 'error', 'stack', 'context');
        logger.error(error);
        logger.error(1, 'stack', 'context');
        logger.error('abc', error, 'updated error stack', 'context');

        // expect(PINO_MOCKS.error).toHaveBeenCalledTimes(7);
        expectNthLog(1, { err: { message: 'error', stack: 'stack' }, context: 'context' });
        expectNthLog(2, { msg: 1, context: 'context' });
        expectNthLog(3, { msg: 'text', context: 'context' });
        expectNthLog(4, { err: { message: 'error', stack: 'stack' }, context: 'context' });
        expectNthLog(5, { err: error });
        expectNthLog(6, { err: { message: 1, stack: 'stack' }, context: 'context' });
        expectNthLog(7, { msg: 'abc', context: 'context' });
        expectNthLog(8, {
          err: { message: error.message, stack: 'updated error stack' },
          context: 'context',
        });
      });
    });
  });
});
