import { Module } from '@nestjs/common';
import { DiarioService } from './diario.service';
import { DiarioController } from './diario.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiarioController],
  providers: [DiarioService],
  exports: [DiarioService], // <-- ESSENCIAL: Adicione esta linha
})
export class DiarioModule {}