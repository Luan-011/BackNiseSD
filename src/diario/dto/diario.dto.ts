import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CriarDiarioDto {
  titulo: string;
  descricao: string;
  conteudo?: string;
  
  // Mude de 'number' para 'string'
  idPaciente: string; 
}