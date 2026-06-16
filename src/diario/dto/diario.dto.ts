import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class CriarDiarioDto {

    @IsString()
    titulo: string

    @IsString()
    descricao: string

    @IsNumber()
    @IsNotEmpty()
    idPaciente: number
}