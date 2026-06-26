import { Injectable, Inject, forwardRef } from '@nestjs/common';import { PrismaService } from '../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { IaController } from './ia.controller';
import { DiarioModule } from '../diario/diario.module'; // Importe o módulo

@Module({
  imports: [forwardRef(() => DiarioModule)], // Importa o DiarioModule com forwardRef
  providers: [IaService],
  exports: [IaService] // <--- ESSA LINHA É OBRIGATÓRIA
})
export class IaModule {}