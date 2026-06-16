import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { IaController } from './ia.controller';
import { DiarioModule } from '../diario/diario.module';

@Module({
  imports: [DiarioModule], // O IaModule consome o DiarioModule
  controllers: [IaController],
  providers: [IaService],
})
export class IaModule {}