import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { DiarioService } from "../diario/diario.service";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class IaService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @Inject(forwardRef(() => DiarioService))
    private readonly diarioService: DiarioService
  ) {
    // Garante que a chave existe e não tem espaços extras
    const apiKey = process.env.GEMINI_API_KEY?.trim() || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async gerarFeedbackDiario(conteudo: string) {
    try {
      // Usando o prefixo 'models/' e o modelo gemini-1.5-pro que é mais estável
      const model = this.genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
      
      const prompt = `Analise este relato de diário e forneça um retorno acolhedor: ${conteudo}. 
      Retorne em um formato JSON puro (sem markdown ou blocos de código), contendo as chaves: 
      mensagem, emocao_predominante, gatilhos_provaveis (array), dicas_de_manejo (array).`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Remove possíveis marcações de markdown mesmo assim
      const cleanedText = responseText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedText);
      
    } catch (error) {
      console.error("Erro detalhado na chamada da IA:", error);
      return null;
    }
  }

  async gerarResumoSemanal(idPaciente: string) {
    // ... seu código de resumo semanal permanece igual
    return { 
        mensagem: "Resumo semanal em desenvolvimento.",
        emocao_predominante: "Neutro",
        gatilhos_provaveis: [],
        dicas_de_manejo: []
      };
  }
}