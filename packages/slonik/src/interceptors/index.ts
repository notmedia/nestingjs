import { createLoggerInterceptor } from './with-logger';
import { createTimezoneInterceptor } from './with-timezone';

export const SlonikInterceptors = {
  withLogger: createLoggerInterceptor,
  withTimezone: createTimezoneInterceptor,
};
