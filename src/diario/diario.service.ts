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

    // Se o feedback estiver vazio ou nulo, retorne um objeto padrão seguro
    if (!diario || !diario.feedbackIA) {
      return { 
        feedbackIA: { 
          mensagem: "Nenhum feedback gerado para este dia.", 
          dicas_de_manejo: [] 
        } 
      };
    }

    // Se tiver conteúdo, tenta fazer o parse
    try {
      return { feedbackIA: JSON.parse(diario.feedbackIA) };
    } catch (e) {
      return { feedbackIA: { mensagem: diario.feedbackIA, dicas_de_manejo: [] } };
    }
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

    try {
      console.log("Chamando IA para o diário:", novoDiario.id);
      const feedbackObj = await this.iaService.gerarFeedbackDiario(dados.conteudo);

      if (feedbackObj) {
        console.log("IA gerou feedback com sucesso!");
        await this.prisma.diario.update({
          where: { id: novoDiario.id },
          data: { feedbackIA: JSON.stringify(feedbackObj) }
        });
      } else {
        console.log("IA retornou nulo!");
      }
    } catch (error) {
      console.error("ERRO CRÍTICO NA IA:", error);
    }

    return novoDiario;
  }
}