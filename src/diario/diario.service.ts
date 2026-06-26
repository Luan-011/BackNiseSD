import { Injectable, Inject, forwardRef } from '@nestjs/common';import { PrismaService } from '../prisma/prisma.service';
import { IaService } from '../ia/ia.service'; // Importe o IaService
@Injectable()
export class DiarioService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => IaService)) // <--- Adicione o @Inject e o forwardRef aqui
    private readonly iaService: IaService
  ) {}

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
    // 1. Cria o registro no banco
    const diario = await this.prisma.diario.create({
      data: {
        titulo: dados.titulo,
        descricao: dados.descricao,
        conteudo: dados.conteudo,
        dataRegistro: new Date(dados.data),
        pacienteId: dados.idPaciente
      }
    });

    // 2. Chama a IA para gerar o feedback baseada no conteúdo do diário
    const feedback = await this.iaService.gerarFeedbackDiario(dados.conteudo);

    // 3. Se a IA responder, salvamos o feedback no diário
    if (feedback) {
      await this.prisma.diario.update({
        where: { id: diario.id },
        data: { feedbackIA: JSON.stringify(feedback) } // Salvamos o objeto como string no banco
      });
    }

    return diario;
  }
}