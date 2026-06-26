import { Injectable, Inject, forwardRef, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IaService } from "../ia/ia.service";

@Injectable()
export class DiarioService {
  constructor(
    private prismaService: PrismaService,
    @Inject(forwardRef(() => IaService))
    private iaService: IaService
  ) {}

  async obterResumoSemanal(pacienteId: string) {
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

    const diarios = await this.prismaService.diario.findMany({
      where: {
        pacienteId: pacienteId,
        createdAt: { gte: umaSemanaAtras }
      }
    });

    const textos = diarios.map(d => d.conteudo).join(" | ");
    const feedbackSemanal = await this.gerarFeedbackIA(textos);

    return {
      periodo: "Últimos 7 dias",
      totalDiarios: diarios.length,
      analise: feedbackSemanal
    };
  }

  async getDiarios(idPaciente: string) {
    try {
      const paciente = await this.prismaService.paciente.findUnique({
        where: { id: idPaciente },
        include: { diarios: { orderBy: { createdAt: 'desc' } } },
      });

      if (!paciente) {
        throw new NotFoundException("Paciente não encontrado.");
      }

      return paciente.diarios;
    } catch (error) {
      console.error("Erro em getDiarios:", error);
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
      console.error("Erro em getDiariosDaSemana:", error);
      throw new InternalServerErrorException("Erro ao buscar diários da semana.");
    }
  }

// Altere apenas o tipo de Promise<string> para Promise<any>
  async gerarFeedbackIA(conteudoDiario: string): Promise<any> {
    try {
      // Como você quer o resumo, usamos o método do seu IaService
      // Nota: Aqui passamos um ID fictício ou real, conforme o seu serviço espera
      return await this.iaService.gerarResumoSemanal("id-do-paciente");
    } catch (error) {
      // Retorna a mensagem de erro padronizada no mesmo formato de objeto
      return { 
        mensagem: "A Nise não conseguiu processar seu relato agora. Tente novamente."
      };
    }
  }

  async getDiasRegistradosNoMes(idPaciente: string, ano: number, mes: number) {
    try {
      const inicioMes = new Date(ano, mes - 1, 1);
      const fimMes = new Date(ano, mes, 0, 23, 59, 59);

      const diarios = await this.prismaService.diario.findMany({
        where: {
          pacienteId: idPaciente,
          createdAt: {
            gte: inicioMes,
            lte: fimMes,
          },
        },
        select: { createdAt: true },
      });

      const dias = diarios.map(d => d.createdAt.getDate());
      return [...new Set(dias)];
    } catch (error) {
      console.error("Erro em getDiasRegistradosNoMes:", error);
      throw new InternalServerErrorException("Erro ao buscar dias registrados.");
    }
  }

  async getFeedbackPorData(data: string) {
    try {
      return await this.prismaService.diario.findFirst({
        where: {
          createdAt: {
            gte: new Date(`${data}T00:00:00Z`),
            lte: new Date(`${data}T23:59:59Z`)
          }
        },
        select: { feedbackIA: true }
      });
    } catch (error) {
      throw new InternalServerErrorException("Erro ao buscar feedback.");
    }
  }

async criarDiario(dados: any) {
    try {
      // 1. Gera o feedback simulado (que retorna um objeto completo)
      const resultadoIA = await this.gerarFeedbackIA(dados.conteudo);

      return await this.prismaService.diario.create({
        data: {
          titulo: dados.titulo,
          descricao: dados.descricao,
          conteudo: dados.conteudo,
          // 2. SALVE APENAS A MENSAGEM DO OBJETO!
          // Isso garante que feedbackIA seja uma STRING.
          feedbackIA: resultadoIA.mensagem, 
          data: new Date(),
          paciente: { connect: { id: dados.idPaciente } }
        }
      });
    } catch (error: any) {
      console.error("ERRO DETALHADO NO PRISMA:", error);
      throw new InternalServerErrorException(error.message);
    }
  }
}