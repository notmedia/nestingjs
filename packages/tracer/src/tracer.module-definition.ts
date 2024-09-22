import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass } = new ConfigurableModuleBuilder()
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
