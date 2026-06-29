import { Injectable } from "@nestjs/common";
import { VertexAI } from "@google-cloud/vertexai";

@Injectable()
export class IaService {
  private generativeModel: any;

  constructor() {
    // O VertexAI vai buscar a autenticação automaticamente do seu ambiente
    // Ele NÃO espera uma string de chave, ele espera o ambiente autenticado
    const vertexAI = new VertexAI({
      project: 'nome-do-seu-projeto-aqui', // Coloque exatamente o ID do projeto que você criou
      location: 'us-central1'
    });

    this.generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  async gerarFeedbackDiario(conteudo: string) {
    try {
      const response = await this.generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: conteudo }] }],
      });
      return JSON.parse(response.response.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Erro na Vertex AI:", error);
      return null;
    }
  }
  // No seu src/ia/ia.service.ts
async gerarResumoSemanal(conteudo: string) {
  try {
    // Verifique se 'this.generativeModel' foi inicializado corretamente no construtor
    const response = await this.generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Resuma estes relatos: ${conteudo}` }] }],
    });
    
    // Verifique se a resposta contém os campos antes de acessar
    return response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sem conteúdo";
  } catch (error) {
    console.error("Erro no resumo:", error);
    return null; // Isso fará o catch no DiarioService capturar e retornar a mensagem segura
  }
}
}