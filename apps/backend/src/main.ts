import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { BACKEND_PORT } from '@tictactoe/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(BACKEND_PORT);
}

bootstrap();
