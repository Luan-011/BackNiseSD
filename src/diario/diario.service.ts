import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { IaService } from "../ia/ia.service";

@Injectable()
export class DiarioService {
  constructor(
    private prisma: PrismaService,
    private iaService: IaService
  ) { }

  async criarDiario(pacienteId: string, conteudo: string, titulo: string, descricao: string) {
    console.log("Tentando criar com:", { pacienteId, titulo }); // Isso vai aparecer no LOG do Render!

    const novoDiario = await this.prisma.diario.create({
      data: { pacienteId, conteudo, titulo, descricao, dataRegistro: new Date() }
    });

    console.log("Diário criado, ID:", novoDiario.id);

    try {
      const feedbackJson = await this.iaService.gerarFeedbackDiario(conteudo);
      console.log("IA respondeu:", feedbackJson);

      if (feedbackJson) {
        await this.prisma.diario.update({
          where: { id: novoDiario.id },
          data: { feedbackIA: feedbackJson }
        });
        console.log("Feedback salvo no banco!");
      }
    } catch (e) {
      console.error("Erro na chamada da IA:", e);
    }

    return novoDiario;
  }
  // MÉTODO NOVO: Lista todos os diários
  async getDiarios(pacienteId: string) {
    return await this.prisma.diario.findMany({
      where: { pacienteId },
      orderBy: { dataRegistro: 'desc' }
    });
  }

  // MÉTODO NOVO: Busca dias com registro
  async getDiasComRegistro(pacienteId: string, ano: string, mes: string) {
    const start = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    const end = new Date(parseInt(ano), parseInt(mes), 0, 23, 59, 59);

    const registros = await this.prisma.diario.findMany({
      where: {
        pacienteId,
        dataRegistro: { gte: start, lte: end }
      },
      select: { dataRegistro: true }
    });

    // Retorna apenas os dias (ex: [1, 5, 10])
    return registros.map(r => r.dataRegistro.getDate());
  }

  // MÉTODO CORRIGIDO: O que o IaController chama
  async getResumoSemanal(pacienteId: string) {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const relatos = await this.prisma.diario.findMany({
      where: {
        pacienteId,
        dataRegistro: { gte: seteDiasAtras }
      },
      select: { conteudo: true }
    });

    const textos = relatos.map(r => r.conteudo).join("\n\n");

    // Verifique se IaService tem este método!
    return await this.iaService.gerarResumoSemanal(textos);
  }

  async getFeedbackPorData(pacienteId: string, data: string) {
    // data vem como '2026-06-29'
    const inicioDoDia = new Date(`${data}T00:00:00Z`);
    const fimDoDia = new Date(`${data}T23:59:59Z`);

    const diario = await this.prisma.diario.findFirst({
      where: {
        pacienteId,
        dataRegistro: { gte: inicioDoDia, lte: fimDoDia }
      }
    });

    console.log("Busca no banco para", data, ":", diario ? "Encontrado" : "Não encontrado");

    if (!diario || !diario.feedbackIA) return null;

    // Se for string, tenta fazer o parse, se já for objeto, retorna ele mesmo
    return typeof diario.feedbackIA === 'string'
      ? JSON.parse(diario.feedbackIA)
      : diario.feedbackIA;
  }
}