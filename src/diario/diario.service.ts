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
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        conteudo: dados.conteudo,
        data: new Date(dados.data), // Colocamos o 'new Date' direto aqui
        pacienteId: dados.idPaciente // Usamos a referência direta da chave estrangeira
      }
    });
  } catch (error) {
    console.error("Erro completo do Prisma:", error);
    throw new Error("Erro ao criar entrada no diário.");
  }
}
}