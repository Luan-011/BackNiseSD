// No seu src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita o CORS (para o front-end conversar com o back-end sem bloqueios)
  app.enableCors(); 

  // Escuta em 0.0.0.0 (aceita conexões do celular/rede local)
  await app.listen(3000, '0.0.0.0');
}
bootstrap();