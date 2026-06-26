// src/ia/ia.module.ts
import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { IaController } from './ia.controller';
import { DiarioModule } from '../diario/diario.module'; // Importe o módulo

@Module({
  imports: [DiarioModule], // <--- ADICIONE O MÓDULO AQUI
  controllers: [IaController],
  providers: [IaService],
})
export class IaModule {}