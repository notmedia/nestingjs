import PinoPretty, { PrettyOptions } from 'pino-pretty';

export type PinoMessage = Record<string, unknown> & {
  context?: string;
  trace_id?: string;
};

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

export default (options: PinoPrettyOptions) => {
  const { contextKey = 'context', traceKey = 'trace', errorKey = 'err', ...opts } = options;

  return PinoPretty({
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l p',
    customLevels: 'verbose:10,debug:20,log:30,warn:40,error:50,fatal:60,',
    colorizeObjects: true,
    colorize: true,
    ignore: `pid,hostname,${contextKey}`,
    customPrettifiers: {
      [contextKey]: (value, key, log, { colors }) => colors.blue(value as string),
      [traceKey]: (value, key, log, { colors }) => colors.gray(value as string),
      [errorKey]: (value, key, log, { colors }) =>
        colors.red((value as Error)?.stack ?? (value as Error)?.message),
    },
    messageFormat: (log: PinoMessage, messageKey, label, { colors }) => {
      const messages: string[] = [];

      if (log[contextKey] !== undefined) {
        messages.push(`${colors.blue(`[${log[contextKey] as string}]`)}`);
      }

      if (log[messageKey] !== undefined) {
        messages.push(log[messageKey] as string);
      }

      const message = messages.join(' ');

      switch (log[opts.levelKey ?? 'level']) {
        case 10:
        case 20:
          return colors.gray(message);
        case 30:
          return colors.green(message);
        case 40:
          return colors.yellow(message);
        case 50:
        case 60:
          return colors.red(message);
        default:
          return colors.white(message);
      }
    },
    ...opts,
  });
};
