import { Injectable, Inject, forwardRef } from "@nestjs/common";
import OpenAI from "openai";
import { DiarioService } from "../diario/diario.service";

@Injectable()
export class IaService {
  private openai: OpenAI;

  constructor(
    @Inject(forwardRef(() => DiarioService))
    private readonly diarioService: DiarioService
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });
  }

async gerarFeedbackDiario(conteudo: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ 
          role: "user", 
          content: `Analise este relato de diário e retorne APENAS um objeto JSON com as chaves: "mensagem", "emocao_predominante", "gatilhos_provaveis" (array) e "dicas_de_manejo" (array). Não use markdown, apenas o JSON puro. Relato: ${conteudo}` 
        }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      let rawContent = completion.choices[0].message.content || "{}";
      
      // Limpeza robusta: remove qualquer coisa que não seja o JSON
      const cleanJson = rawContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanJson);
    } catch (error) {
      console.error("Erro ao processar JSON da IA:", error);
      return null;
    }
  }//askjdkadhd
  async gerarResumoSemanal(conteudo: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{
          role: "user",
          content: `Resuma os seguintes relatos de diário: ${conteudo}`
        }],
        model: "llama-3.3-70b-versatile"
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Erro no resumo:", error);
      return "Não foi possível gerar o resumo.";
    }
  }
}