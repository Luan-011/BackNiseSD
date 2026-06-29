import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { DiarioService } from "../diario/diario.service";
import { VertexAI } from '@google-cloud/vertexai';

@Injectable()
export class IaService {
  private vertexAI: VertexAI;

  constructor(
    @Inject(forwardRef(() => DiarioService))
    private readonly diarioService: DiarioService
  ) {
    // Carrega o JSON da variável de ambiente do Render
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}");

    this.vertexAI = new VertexAI({
      project: credentials.project_id || 'SEU_ID_DO_PROJETO',
      location: 'us-central1',
      googleAuthOptions: { credentials }
    });
  }

  async gerarFeedbackDiario(conteudo: string) {
    try {
      const generativeModel = this.vertexAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt = `Analise este relato de diário e forneça um retorno acolhedor: ${conteudo}. 
      Retorne APENAS um JSON (sem texto explicativo, sem markdown), com estas chaves: 
      "mensagem", "emocao_predominante", "gatilhos_provaveis" (array), "dicas_de_manejo" (array).`;

      const response = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const text = response.response.candidates[0].content.parts[0].text;

      // Limpeza de segurança para garantir que o retorno seja um JSON puro
      const cleanedText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedText);

    } catch (error) {
      console.error("ERRO FINAL NO IA.SERVICE:", error.message);
      return null;
    }
  }
  // Adicione este método no src/ia/ia.service.ts
  async gerarResumoSemanal(conteudo: string) {
    try {
      const generativeModel = this.vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analise estes relatos da semana e forneça um resumo acolhedor: ${conteudo}.`;

      const response = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      return response.response.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Erro no resumo:", error.message);
      return null;
    }
  }
}