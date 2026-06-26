import { Module, forwardRef } from '@nestjs/common';
import { DiarioService } from './diario.service';
import { DiarioController } from './diario.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IaModule } from '../ia/ia.module'; // Importe o IaModule

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => IaModule), // Importe com forwardRef
  ],
  controllers: [DiarioController],
  providers: [DiarioService],
  exports: [DiarioService], // Exporte o serviço para o IaModule usar
})
export class DiarioModule {}