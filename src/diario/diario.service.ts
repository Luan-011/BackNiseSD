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
  // Adicione este método na classe DiarioService
  async gerarFeedbackManual(id: string) {
    const diario = await this.prisma.diario.findUnique({ where: { id } });

    if (!diario) throw new Error("Diário não encontrado");

    // Chama a IA
    const feedbackJson = await this.iaService.gerarFeedbackDiario(diario.conteudo);

    if (feedbackJson) {
      return await this.prisma.diario.update({
        where: { id: id },
        data: { feedbackIA: feedbackJson }
      });
    }
    return diario;
  }

async forcarRegistroManual(pacienteId: string, dataISO: string, conteudo: string) {
  // Ajuste para pegar o início e fim do dia (para o findFirst funcionar)
  const dataRef = new Date(dataISO);
  const inicio = new Date(dataRef.setUTCHours(0, 0, 0, 0));
  const fim = new Date(dataRef.setUTCHours(23, 59, 59, 999));

  // Tenta encontrar um diário com esse paciente e nessa data
  const existente = await this.prisma.diario.findFirst({
    where: { 
      pacienteId: pacienteId,
      dataRegistro: { 
        gte: inicio, 
        lte: fim 
      } 
    }
  });

  if (existente) {
    // Atualiza o existente (usando os nomes do seu schema)
    return await this.prisma.diario.update({
      where: { id: existente.id },
      data: { 
        conteudo: conteudo,
        // Caso queira atualizar o titulo ou descricao também, pode adicionar aqui
      }
    });
  } else {
    // Cria um novo (usando os nomes do seu schema)
    return await this.prisma.diario.create({
      data: {
        pacienteId: pacienteId,
        dataRegistro: inicio, // O Prisma cuida do @map("data") sozinho
        conteudo: conteudo,
        titulo: "Relato Diário", // Campo obrigatório no seu schema
        descricao: "Relato inserido manualmente" // Campo obrigatório no seu schema
      }
    });
  }
}
  async getFeedbackPorData(pacienteId: string, data: string) {
    // Garante que a data seja processada como início e fim do dia em UTC
    // A string 'data' deve chegar no formato 'YYYY-MM-DD'
    const inicioDoDia = new Date(`${data}T00:00:00Z`);
    const fimDoDia = new Date(`${data}T23:59:59Z`);

    const diario = await this.prisma.diario.findFirst({
      where: {
        pacienteId,
        dataRegistro: {
          gte: inicioDoDia,
          lte: fimDoDia
        }
      }
    });

    // Se não encontrar o diário, retorna null
    if (!diario) return null;

    // Se o diário existe, mas não tem feedbackIA, retorna apenas o objeto do diário
    // (para que o front-end saiba que o diário existe mas precisa de feedback)
    if (!diario.feedbackIA) {
      return {
        id: diario.id,
        feedbackIA: null
      };
    }

    // Se o feedbackIA for uma string (salvo no banco), faz o parse para objeto
    // Se já for objeto (dependendo da configuração do Prisma), retorna ele
    const feedbackFormatado = typeof diario.feedbackIA === 'string'
      ? JSON.parse(diario.feedbackIA)
      : diario.feedbackIA;

    // Retorna o ID junto com o objeto de feedback para que o front possa regerar se necessário
    return {
      id: diario.id,
      ...feedbackFormatado
    };
  }
}