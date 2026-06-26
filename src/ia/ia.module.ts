import { Module, forwardRef } from '@nestjs/common';
import { IaService } from './ia.service';
import { DiarioModule } from '../diario/diario.module'; // Importe o DiarioModule

@Module({
  imports: [
    forwardRef(() => DiarioModule), // Importe com forwardRef
  ],
  providers: [IaService],
  exports: [IaService], // Exporte o serviço para o DiarioModule usar
})
export class IaModule {}