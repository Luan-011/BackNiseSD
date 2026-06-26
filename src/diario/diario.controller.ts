import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DiarioService } from "./diario.service";

@Controller("diarios")
export class DiarioController {
  constructor(private diarioService: DiarioService) {}

  // A rota será: POST /diarios
  @Post() 
  async criarDiario(@Body() criarDiarioDto: any) {
    return this.diarioService.criarDiario(criarDiarioDto);
  }

  // A rota será: GET /diarios/:idPaciente
  @Get(":idPaciente")
  getDiarios(@Param("idPaciente") idPaciente: string) {
    return this.diarioService.getDiarios(idPaciente); 
  }
}