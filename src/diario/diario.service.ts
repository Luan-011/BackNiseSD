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
    return await this.prisma.diario.create({
      data: { // <-- Este 'data' é do Prisma (configuração)
        titulo: dados.titulo,
        descricao: dados.descricao,
        conteudo: dados.conteudo,
        dataRegistro: new Date(dados.data), // <-- Este 'dataRegistro' é sua coluna
        pacienteId: dados.idPaciente
      }
    });
  } catch (error) {
    console.error("Erro:", error);
    throw new Error("Erro ao criar.");
  }
}
}