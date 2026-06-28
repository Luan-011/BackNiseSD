import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IaService } from '../ia/ia.service';

@Injectable()
export class DiarioService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => IaService))
    private readonly iaService: IaService
  ) { }

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
    // Ajuste: pegamos o primeiro dia do mês e o último dia do mês de forma segura
    const mesNumero = parseInt(mes) - 1; // Meses no JS vão de 0 a 11
    const dataInicio = new Date(parseInt(ano), mesNumero, 1);
    const dataFim = new Date(parseInt(ano), mesNumero + 1, 0, 23, 59, 59);

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

    // Retorna um array único de dias para evitar duplicatas
    const dias = diarios.map((d) => d.dataRegistro.getDate());
    return [...new Set(dias)];
  }
  // No seu DiarioService.ts, dentro do método getFeedbackPorData:
  async getFeedbackPorData(idPaciente: string, dataBusca: string) {
    const dataInicio = new Date(dataBusca);
    dataInicio.setUTCHours(0, 0, 0, 0);
    const dataFim = new Date(dataBusca);
    dataFim.setUTCHours(23, 59, 59, 999);

    const diario = await this.prisma.diario.findFirst({
      where: {
        pacienteId: idPaciente,
        dataRegistro: { gte: dataInicio, lte: dataFim },
      },
      select: { feedbackIA: true },
    });

    // Se tiver feedback, retorna o objeto, se não, uma mensagem padrão
    return {
      feedbackIA: diario?.feedbackIA ? JSON.parse(diario.feedbackIA) : { mensagem: "Nenhum feedback gerado." }
    };

  }


  async criarDiario(dados: any) {
    const novoDiario = await this.prisma.diario.create({
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        conteudo: dados.conteudo,
        dataRegistro: new Date(dados.data),
        pacienteId: dados.idPaciente
      }
    });

    // Chama a IA e salva o resultado
    try {
      const feedbackObj = await this.iaService.gerarFeedbackDiario(dados.conteudo);
      if (feedbackObj) {
        await this.prisma.diario.update({
          where: { id: novoDiario.id },
          data: { feedbackIA: JSON.stringify(feedbackObj) } // Salva como string JSON
        });
      }
    } catch (error) {
      console.error("Erro ao salvar feedback da IA:", error);
    }

    return novoDiario;
  }
}