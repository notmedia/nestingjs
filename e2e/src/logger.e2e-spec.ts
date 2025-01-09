import { LoggerModule } from '@nestingjs/logger';
import { TracerModule } from '@nestingjs/tracer';
import { INestApplication, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';

@Module({
  imports: [TracerModule, LoggerModule.forRoot({ isGlobal: true })],
})
class AppModule {}

describe('Logger', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
});
