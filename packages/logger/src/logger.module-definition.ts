import { ConfigurableModuleBuilder, LogLevel } from '@nestjs/common';
import pino from 'pino';

export type LoggerModuleOptions = {
  /**
   * One of the supported levels ["verbose", "debug", "log", "warn", "error", "fatal"]
   * @default log
   */
  level?: LogLevel;
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
} & Omit<pino.LoggerOptions<LogLevel, true>, 'customLevels' | 'useOnlyCustomLevels'>;

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<LoggerModuleOptions>()
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      })
    )
    .setClassMethodName('forRoot')
    .build();
