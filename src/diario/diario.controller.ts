import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DiarioService } from "./diario.service";

@Controller("diarios")
export class DiarioController {
  constructor(private readonly diarioService: DiarioService) { }

  @Post()
  async criar(@Body() body: { pacienteId: string, conteudo: string, titulo: string, descricao: string }) {
    return await this.diarioService.criarDiario(body.pacienteId, body.conteudo, body.titulo, body.descricao);
  }

  @Get("feedback/:data")
  async getFeedback(@Param('data') data: string) {
    return await this.diarioService.getFeedbackPorData("134fa6c0-4a7e-4dec-a29a-81081d00122e", data);
  }

  @Get("lista/:idPaciente")
  async getDiarios(@Param('idPaciente') idPaciente: string) {
    return await this.diarioService.getDiarios(idPaciente);
  }

  @Get(":idPaciente/calendario/:ano/:mes")
  async getCalendario(
    @Param('idPaciente') idPaciente: string,
    @Param('ano') ano: string,
    @Param('mes') mes: string,
  ) {
    return await this.diarioService.getDiasComRegistro(idPaciente, ano, mes);
  }
}