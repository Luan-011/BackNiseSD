import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ESSA LINHA É A QUE LIBERA O ACESSO PARA O SEU CELULAR
  app.enableCors(); 
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();