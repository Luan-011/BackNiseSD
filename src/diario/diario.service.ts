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
    const novoDiario = await this.prisma.diario.create({
      data: { pacienteId, conteudo, titulo, descricao, dataRegistro: new Date() }
    });

    try {
      const feedbackJson = await this.iaService.gerarFeedbackDiario(conteudo);
      if (feedbackJson) {
        await this.prisma.diario.update({
          where: { id: novoDiario.id },
          data: { feedbackIA: feedbackJson }
        });
      }
    } catch (e) {
      console.error("Erro na chamada da IA:", e);
    }
    return novoDiario;
  }

  async getDiarios(pacienteId: string) {
    return await this.prisma.diario.findMany({
      where: { pacienteId },
      orderBy: { dataRegistro: 'desc' }
    });
  }

  async getDiasComRegistro(pacienteId: string, ano: string, mes: string) {
    const start = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    const end = new Date(parseInt(ano), parseInt(mes), 0, 23, 59, 59);

    const registros = await this.prisma.diario.findMany({
      where: { pacienteId, dataRegistro: { gte: start, lte: end } },
      select: { dataRegistro: true }
    });

    return registros.map(r => r.dataRegistro.getDate());
  }

  // MÉTODO AJUSTADO PARA LIDAR COM DIAS SEM REGISTRO
async getResumoSemanal(pacienteId: string, dataInicio: Date, dataFim: Date) {
  // 1. Busca o nome do paciente
// 1. Busca os campos do nome no banco
const paciente = await this.prisma.paciente.findUnique({
  where: { id: pacienteId },
  select: { primeiroNome: true, sobreNome: true }
});

// 2. Concatena os nomes ou usa um padrão
const nomeUsuario = paciente 
  ? `${paciente.primeiroNome} ${paciente.sobreNome}` 
  : "usuário";

  const relatos = await this.prisma.diario.findMany({
    where: { pacienteId, dataRegistro: { gte: dataInicio, lte: dataFim } },
    orderBy: { dataRegistro: 'asc' }
  });

  const diasExistentes = new Map(relatos.map(r => [r.dataRegistro.toISOString().split('T')[0], r]));

  let textos = "";
  for (let d = new Date(dataInicio); d <= dataFim; d.setDate(d.getDate() + 1)) {
    const dataStr = d.toISOString().split('T')[0];
    if (diasExistentes.has(dataStr)) {
      textos += `${dataStr}: ${diasExistentes.get(dataStr).conteudo}\n`;
    } else {
      textos += `${dataStr}: [Nenhum registro realizado neste dia]\n`;
    }
  }

  // 2. Passa o nome para a IA
  return await this.iaService.gerarResumoSemanal(textos, nomeUsuario);
}
  async gerarFeedbackManual(id: string) {
    const diario = await this.prisma.diario.findUnique({ where: { id } });
    if (!diario) throw new Error("Diário não encontrado");

    const feedbackJson = await this.iaService.gerarFeedbackDiario(diario.conteudo);
    if (feedbackJson) {
      return await this.prisma.diario.update({
        where: { id: id },
        data: { feedbackIA: feedbackJson }
      });
    }
    return diario;
  }

  async forcarRegistroManual(pacienteId: string, dataISO: string, conteudo: string, titulo: string, descricao: string) {
    const dataRef = new Date(dataISO);
    const inicio = new Date(dataRef.setUTCHours(0, 0, 0, 0));
    
    const existente = await this.prisma.diario.findFirst({
      where: { pacienteId, dataRegistro: { gte: inicio, lte: new Date(dataRef.setUTCHours(23, 59, 59, 999)) } }
    });

    if (existente) {
      return await this.prisma.diario.update({
        where: { id: existente.id },
        data: { conteudo, titulo, descricao }
      });
    } else {
      return await this.prisma.diario.create({
        data: { pacienteId, dataRegistro: inicio, conteudo, titulo, descricao }
      });
    }
  }

  async getFeedbackPorData(pacienteId: string, data: string) {
    const inicioDoDia = new Date(`${data}T00:00:00Z`);
    const fimDoDia = new Date(`${data}T23:59:59Z`);

    const diario = await this.prisma.diario.findFirst({
      where: { pacienteId, dataRegistro: { gte: inicioDoDia, lte: fimDoDia } }
    });

    if (!diario) return null;
    if (!diario.feedbackIA) return { id: diario.id, feedbackIA: null };

    const feedbackFormatado = typeof diario.feedbackIA === 'string'
      ? JSON.parse(diario.feedbackIA)
      : diario.feedbackIA;

    return { id: diario.id, ...feedbackFormatado };
  }
}