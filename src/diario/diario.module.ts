import { Module, forwardRef } from '@nestjs/common';
import { DiarioService } from './diario.service';
import { DiarioController } from './diario.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IaModule } from '../ia/ia.module';

@Module({
  imports: [
    PrismaModule, 
    forwardRef(() => IaModule)
  ],
  controllers: [DiarioController],
  providers: [DiarioService],
  exports: [DiarioService]
})
export class DiarioModule {}