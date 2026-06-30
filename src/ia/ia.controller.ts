import { Controller, Get, Param } from '@nestjs/common';
import { DiarioService } from '../diario/diario.service'; // Importe o DiarioService

@Controller('ia')
export class IaController {
  constructor(private readonly diarioService: DiarioService) { } // Injete o DiarioService

  @Get("resumo/:idPaciente/:dataInicio/:dataFim")
  async getResumo(@Param('idPaciente') idPaciente: string, @Param('dataInicio') dataInicio: string, @Param('dataFim') dataFim: string) {
    // Passando os 3 argumentos exigidos agora
    return await this.diarioService.getResumoSemanal(
      idPaciente,
      new Date(dataInicio),
      new Date(dataFim)
    );
  }
}