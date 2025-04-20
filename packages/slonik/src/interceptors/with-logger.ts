import { LoggerService } from '@nestjs/common';
import { Interceptor } from 'slonik';

export type LoggerInterceptorOptions = {
  /**
   * Message key where to write SQL query
   * @default msg
   */
  messageKey?: string;
};

export function createLoggerInterceptor(
  logger: LoggerService,
  options: LoggerInterceptorOptions = {}
): Interceptor {
  const { messageKey = 'msg' } = options;

  return {
    beforeTransformQuery: (context) => {
      logger.debug?.({
        [messageKey]: context.originalQuery.sql,
        values: context.originalQuery.values,
      });

      return Promise.resolve(null);
    },
  };
}
