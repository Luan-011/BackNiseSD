import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // O ponto é crucial!
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // O uso de process.env.PORT é o padrão universal para nuvem (Render, Railway, Heroku)
  const port = process.env.PORT || 3000;
  
  // '0.0.0.0' é necessário para que a nuvem consiga acessar o serviço
  await app.listen(port, '0.0.0.0'); 
  
  console.log(`Servidor rodando na porta ${port}`);
}
bootstrap();