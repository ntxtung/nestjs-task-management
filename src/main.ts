import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  const configService = app.get(ConfigService);
  const appName = configService.get('APP_NAME');
  const host = configService.get('APP_HOST');
  const port = configService.get('APP_PORT');
  const logger = new Logger('bootstrap');
  await app.listen(port, host);
  logger.log(`App ${appName} is listening on ${host}:${port}`);
}

bootstrap();
