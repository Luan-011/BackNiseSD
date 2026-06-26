import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { DiarioService } from "../diario/diario.service";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class IaService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

  constructor(
    @Inject(forwardRef(() => DiarioService))
    private readonly diarioService: DiarioService
  ) {}
async gerarFeedbackDiario(conteudo: string) {
  try {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analise este relato de diário e forneça um retorno acolhedor: ${conteudo}. Retorne em um formato JSON com as chaves: mensagem, emocao_predominante, gatilhos_provaveis (array), dicas_de_manejo (array).`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Limpa o texto da IA caso ele venha com marcações de markdown ```json
    const cleanedText = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
    
  } catch (error) {
    console.error("Erro na chamada da IA:", error);
    return null; // Retorna null para o Diário saber que não conseguiu gerar
  }
}
  async gerarResumoSemanal(idPaciente: string) {
    try {
      // Estrutura otimizada para leitura rápida e engajamento do usuário
      const respostaFormatadaIA = {
        mensagem: `
          Seu feedback semanal:
          
          • Sua emoção mais predominante foi a Felicidade e Empolgação. Isso se dá por momentos positivos como quando você tirou uma nota boa na sua prova de Matemática, o que é ótimo! Continue assim, celebrando suas conquistas, mesmo as pequenas.
          
          • Gatilhos possíveis:
          Seus possíveis gatilhos para crises ou quedas de humor são: Ter que se expor em atividades físicas devido a inseguranças com o corpo e o nervosismo acumulado por provas que acabam sendo adiadas.
          
          • Sugestões:
          Sugestões para você melhorar crises ou amenizar as oscilações:
          - Praticar a respiração diafragmática (técnica do 4-4-4).
          - Conversar com o professor ou coordenador sobre sua insegurança na educação física.
          - Criar um plano de estudos fixo para se sentir mais preparado e seguro para as provas.
        `,
        emocao_predominante: "Felicidade / Empolgação",
        gatilhos_provaveis: ["Insegurança corporal", "Ansiedade pré-prova"],
        dicas_de_manejo: [
          "Exercício de respiração 4-4-4",
          "Conversa aberta com a escola",
          "Plano de estudos semanal"
        ]
      };

      return respostaFormatadaIA;

    } catch (error) {
      console.error("Erro na simulação da IA:", error);
      return { 
        mensagem: "Erro ao carregar seu feedback semanal. Tente novamente em instantes.",
        emocao_predominante: "N/A",
        gatilhos_provaveis: [],
        dicas_de_manejo: []
      };
    }
  }
}