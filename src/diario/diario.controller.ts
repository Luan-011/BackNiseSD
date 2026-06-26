import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DiarioService } from "./diario.service";

@Controller("diarios")
export class DiarioController {
  constructor(private readonly diarioService: DiarioService) {} // Adicionei 'readonly' (boa prática)

  @Post() 
  async criarDiario(@Body() criarDiarioDto: any) {
    return this.diarioService.criarDiario(criarDiarioDto);
  }

  @Get("lista/:idPaciente")
  async getDiarios(@Param("idPaciente") idPaciente: string) {
    // Adicione o 'await' caso o método no service seja 'async'
    return await this.diarioService.getDiarios(idPaciente); 
  }
}