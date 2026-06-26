import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IaService } from '../ia/ia.service';

@Injectable()
export class DiarioService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => IaService))
    private readonly iaService: IaService
  ) {}

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
    return await this.prisma.diario.create({
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        conteudo: dados.conteudo,
        dataRegistro: new Date(dados.data), // Agora usando o novo nome mapeado
        pacienteId: dados.idPaciente
      }
    });
  }
}