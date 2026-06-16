import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DiarioService } from "./diario.service";
import CriarDiarioDto from "./dto/diario.dto";


@Controller("diarios")
export class DiarioController{
    constructor(
        private diarioService : DiarioService
    ){}

@Get(":idPaciente")
getDiarios(
    @Param() idPacienteObject : { idPaciente: string }
){
    // Passa apenas a string, não o objeto todo
    return this.diarioService.getDiarios(idPacienteObject.idPaciente); 
}
    @Post()
    criarDiario(@Body() criarDiarioDto : CriarDiarioDto){
        return this.diarioService.criardiario(criarDiarioDto)
    }
}