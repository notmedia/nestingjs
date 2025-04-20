import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ClientConfigurationInput } from 'slonik';

export type SlonikModuleOptions = {
  /**
   * PostgreSQL [Connection URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
   */
  connectionUri: string;
} & ClientConfigurationInput;

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SlonikModuleOptions>()
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
