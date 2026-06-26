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
async getDiasComRegistro(idPaciente: string, ano: string, mes: string) {
    const dataInicio = new Date(`${ano}-${mes}-01T00:00:00Z`);
    const dataFim = new Date(parseInt(ano), parseInt(mes), 0);

    const diarios = await this.prisma.diario.findMany({
      where: {
        pacienteId: idPaciente,
        dataRegistro: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      select: {
        dataRegistro: true,
      },
    });

    // Retorna apenas o dia (número) de cada registro
    return diarios.map((d) => d.dataRegistro.getDate());
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