import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Isso é essencial para o app falar com o backend
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  // }));
  await app.listen(3000);
}
bootstrap();
