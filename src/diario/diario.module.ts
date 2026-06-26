import { Injectable, Inject, forwardRef } from '@nestjs/common';import { PrismaService } from '../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { DiarioService } from './diario.service';
import { DiarioController } from './diario.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IaModule } from 'src/ia/ia.module';

@Module({
  imports: [
    forwardRef(() => IaModule) // <--- Importa o IaModule aqui
  ],
  controllers: [DiarioController],
  providers: [DiarioService],
  exports: [DiarioService]
})
export class DiarioModule {}