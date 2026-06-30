import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class IaService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
  }

  async gerarFeedbackDiario(conteudo: string): Promise<string | null> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ 
          role: "user", 
          content: `Analise este relato: "${conteudo}". Retorne APENAS um objeto JSON com as chaves: "mensagem", "emocao_predominante", "gatilhos_provaveis" (array), "dicas_de_manejo" (array). Não use Markdown.` 
        }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content || "{}";
      const cleanJson = content.replace(/```json/g, "").replace(/```/g, "").trim();
      
      JSON.parse(cleanJson);
      return cleanJson; 
    } catch (error) {
      console.error("Erro na IA (Feedback):", error);
      return null;
    }
  }

  async gerarResumoSemanal(conteudo: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ 
          role: "system", 
          content: "Você é a Nise, uma IA de saúde mental. Responda seguindo exatamente este formato, sem introduções extras:" 
        }, { 
          role: "user", 
          content: `Analise os relatos abaixo e crie um resumo semanal seguindo este template:
          
          Olá, [Nome]! Aqui está seu resumo:
          [Análise de oscilação emocional]
          
          Padrões identificados
          - Principal gatilho: ...
          - Maior intensidade emocional: ...
          - Melhor dia da semana: ...
          - Dia sem registro: ...
          
          Recomendações
          - [Dica 1]
          - [Dica 2]
          - [Dica 3]
          
          [Para cada dia fornecido, coloque: Data (Nome do dia) - Resumo do que aconteceu].
          
          Relatos fornecidos:
          ${conteudo}` 
        }],
        model: "llama-3.3-70b-versatile"
      });
      
      return completion.choices[0].message.content || "Não foi possível gerar o resumo.";
    } catch (error) {
      console.error("Erro na IA (Resumo):", error);
      return "Erro ao processar o resumo semanal.";
    }
  }
}