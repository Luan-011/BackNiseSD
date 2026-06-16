import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class DiarioService {
  constructor(private prismaService: PrismaService) {}

  async getDiarios(idPaciente: string) {
    try {
      const pacienteComDiarios = await this.prismaService.paciente.findUnique({
        where: { id: idPaciente },
        include: { diarios: true }, 
      });
      return pacienteComDiarios?.diarios || [];
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Erro ao buscar diários.");
    }
  }

  async getDiariosDaSemana(idPaciente: string) {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    try {
      return await this.prismaService.diario.findMany({
        where: {
          pacienteId: idPaciente,
          createdAt: { gte: seteDiasAtras },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException("Erro ao buscar diários da semana.");
    }
  }

  async criardiario(dto: any) {
    try {
      return await this.prismaService.diario.create({
        data: {
          titulo: String(dto.titulo),
          descricao: String(dto.descricao),
          conteudo: String(dto.conteudo || ""),
          paciente: { connect: { id: String(dto.idPaciente) } },
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Erro ao criar entrada no diário.");
    }
  }
}