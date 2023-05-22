import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors() // cors policy kapalı olmazsa api data kabul etmiyor.
  await app.listen(3001);
}
bootstrap();
