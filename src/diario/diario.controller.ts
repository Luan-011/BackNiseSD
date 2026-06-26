import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DiarioService } from "./diario.service";
import { CriarDiarioDto } from "./dto/diario.dto";@Controller("diarios")
export class DiarioController {
  constructor(private diarioService: DiarioService) {}

  @Get(":idPaciente")
  getDiarios(@Param("idPaciente") idPaciente: string) {
    return this.diarioService.getDiarios(idPaciente); 
  }
@Get(":idPaciente/calendario/:ano/:mes")
getDiasCalendario(
  @Param("idPaciente") idPaciente: string,
  @Param("ano") ano: string,
  @Param("mes") mes: string,
) {
  return this.diarioService.getDiasRegistradosNoMes(idPaciente, Number(ano), Number(mes));
}
@Get("feedback/:data")
  async getFeedback(@Param("data") data: string) {
    // Você precisará passar o ID do paciente aqui também no futuro, 
    // mas vamos seguir a lógica que você começou no front
    return this.diarioService.getFeedbackPorData(data);
  }
  
@Post()
  async criarDiario(@Body() criarDiarioDto: any) {
    return this.diarioService.criarDiario(criarDiarioDto);
  }
}  