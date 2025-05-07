import { LoggerService } from '@nestjs/common';
import { Interceptor } from 'slonik';

export type LoggerInterceptorOptions = {
  /**
   * Message key where to write SQL query
   * @default msg
   */
  messageKey?: string;
};

/**
 * Creates an interceptor that logs SQL queries using the provided logger.
 *
 * @param {LoggerService} logger - The logger instance used to output SQL queries.
 * @param {LoggerInterceptorOptions} [options] - Optional configuration for customizing the log output.
 * @returns {Interceptor} An interceptor that logs each SQL query before transformation.
 */
export function createLoggerInterceptor(
  logger: LoggerService,
  options: LoggerInterceptorOptions = {}
): Interceptor {
  const { messageKey = 'msg' } = options;

  return {
    name: 'nestingjs-slonik-logger-interceptor',
    beforeTransformQuery: (context) => {
      logger.verbose?.({
        [messageKey]: context.originalQuery.sql,
        values: context.originalQuery.values,
      });

      return null;
    },
    queryExecutionError: (contex, query, error) => {
      logger.error(query, error);

      return null;
    },
  };
}
