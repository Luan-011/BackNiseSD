import { Controller, Get, Param } from '@nestjs/common';
import { IaService } from './ia.service';

@Controller('ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  @Get('resumo/:idPaciente')
  async getResumo(@Param('idPaciente') idPaciente: string) {
    return await this.iaService.gerarResumoSemanal(idPaciente);
  }
}