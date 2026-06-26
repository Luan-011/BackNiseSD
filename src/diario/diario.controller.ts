import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DiarioService } from "./diario.service";

@Controller("diarios")
export class DiarioController {
  constructor(private readonly diarioService: DiarioService) {}

  @Post() 
  async criarDiario(@Body() criarDiarioDto: any) {
    return this.diarioService.criarDiario(criarDiarioDto);
  }
// No seu DiarioController
@Get("feedback/:data")
async getFeedback(@Param('data') data: string) {
  // O ID_PACIENTE precisaria ser passado via query ou token se não estiver na rota
  return await this.diarioService.getFeedbackPorData("134fa6c0-4a7e-4dec-a29a-81081d00122e", data);
}
  // Corrigido: usando @Param para capturar o ID da URL
  @Get("lista/:idPaciente")
  async getDiarios(@Param('idPaciente') idPaciente: string) {
    return await this.diarioService.getDiarios(idPaciente);
  }

  // Adicionado: Rota que o seu App está procurando (404)
  @Get(":idPaciente/calendario/:ano/:mes")
  async getCalendario(
    @Param('idPaciente') idPaciente: string,
    @Param('ano') ano: string,
    @Param('mes') mes: string,
  ) {
    // Você precisará implementar o método 'getDiasComRegistro' no seu DiarioService
    return await this.diarioService.getDiasComRegistro(idPaciente, ano, mes);
  }
}