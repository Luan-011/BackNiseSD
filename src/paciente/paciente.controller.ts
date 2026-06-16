import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { DeletePaciente, GetPaciente } from "src/auth/decorator";
import { Paciente } from "@prisma/client";
import { PacienteService } from "./paciente.service";
import { UpdateDto } from "src/auth/dto/update.dto";

@UseGuards(JwtGuard)
@Controller('paciente')
export class PacienteController {
    constructor(private PacienteService: PacienteService){}

    @Get('me')
    getMe(@GetPaciente() user: Paciente) {
        return user;
    }

    @Delete(':id')
    async remove(@DeletePaciente() paciente: Paciente, @Param('id') id:number){
return this.PacienteService.remove(String(id))    
}

    @Put(':id')
    async update(@Param('id') id: string, @Body() data:UpdateDto){
        const pacienteId = parseInt(id, 10)
return this.PacienteService.update(String(pacienteId), data)    }
}