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
          content: `Analise este relato de diário e retorne APENAS um objeto JSON com as chaves: "mensagem", "emocao_predominante", "gatilhos_provaveis" (array) e "dicas_de_manejo" (array). Relato: ${conteudo}` 
        }],
        model: "llama3-8b-8192",
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      return JSON.parse(content || "{}");
    } catch (error) {
      console.error("Erro ao chamar o Groq:", error);
      return null;
    }
  }

  async gerarResumoSemanal(conteudo: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ 
          role: "user", 
          content: `Resuma os seguintes relatos de diário destacando padrões de comportamento: ${conteudo}` 
        }],
        model: "llama3-8b-8192"
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Erro no resumo:", error);
      return "Não foi possível gerar o resumo.";
    }
  }
}