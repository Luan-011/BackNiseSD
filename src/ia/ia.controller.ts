import { Controller, Get, Param } from '@nestjs/common';
import { DiarioService } from '../diario/diario.service'; // Importe o DiarioService

@Controller('ia')
export class IaController {
  constructor(private readonly diarioService: DiarioService) {} // Injete o DiarioService

  @Get('resumo/:idPaciente')
  async getResumo(@Param('idPaciente') idPaciente: string) {
    return await this.diarioService.getResumoSemanal(idPaciente);
  }
}