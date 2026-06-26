import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiarioService {
  constructor(private prisma: PrismaService) { }

  // A FUNÇÃO DEVE SE CHAMAR getDiarios
  async getDiarios(idPaciente: string) {
    return await this.prisma.diario.findMany({
      where: {
        pacienteId: idPaciente,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async criarDiario(dados: any) {
  try {
    // 1. Extraímos a data e convertemos para o objeto Date do JS
    const dataDoRegistro = new Date(dados.data);

    // 2. Usamos o nome correto para o campo no banco (dataDoRegistro)
    return await this.prisma.diario.create({
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        conteudo: dados.conteudo,
        data: dataDoRegistro, // <--- Aqui o campo do banco recebe o valor
        paciente: { 
          connect: { id: dados.idPaciente } 
        }
      }
    });
  } catch (error) {
    console.error("Erro completo do Prisma:", error);
    throw new Error("Erro ao criar entrada no diário.");
  }
}
}