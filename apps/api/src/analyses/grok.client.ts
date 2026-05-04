import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Attribute } from '@eitacraque/shared';

export interface GrokAnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  attributeScores: Array<{ attribute: Attribute; score: number }>;
  overallScore: number;
  modelVersion: string;
  raw: unknown;
}

@Injectable()
export class GrokClient {
  private readonly logger = new Logger(GrokClient.name);

  constructor(private readonly config: ConfigService) {}

  async analyzeClip(input: {
    playbackId: string;
    clipType: string;
    position?: string | null;
  }): Promise<GrokAnalysisResult> {
    const apiKey = this.config.get<string>('GROK_API_KEY');
    const baseUrl = this.config.get<string>('GROK_BASE_URL', 'https://api.x.ai/v1');
    const model = this.config.get<string>('GROK_MODEL', 'grok-2-vision-latest');

    if (!apiKey) {
      this.logger.warn('GROK_API_KEY ausente — devolvendo análise stub');
      return this.stub(model);
    }

    const videoUrl = `https://stream.mux.com/${input.playbackId}.m3u8`;
    const prompt = this.buildPrompt(input.clipType, input.position);

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'Você é um analista técnico de futebol. Devolva SEMPRE JSON válido conforme o schema pedido pelo usuário.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: videoUrl } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      this.logger.error(`Grok respondeu ${res.status}: ${body}`);
      return this.stub(model);
    }

    try {
      const data = (await res.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      const parsed = JSON.parse(data.choices[0].message.content) as Omit<GrokAnalysisResult, 'modelVersion' | 'raw'>;
      return { ...parsed, modelVersion: model, raw: data };
    } catch (err) {
      this.logger.error(`Erro ao parsear resposta Grok: ${err}`);
      return this.stub(model);
    }
  }

  private buildPrompt(clipType: string, position?: string | null) {
    return `Analise este lance de futebol (tipo: ${clipType}${position ? `, posição: ${position}` : ''}).
Devolva JSON com este formato exato:
{
  "summary": "string (3-5 frases descrevendo o lance)",
  "strengths": ["string", ...],
  "weaknesses": ["string", ...],
  "attributeScores": [
    { "attribute": "FINISHING|DRIBBLING|PASSING|VISION|PACE|STRENGTH|POSITIONING|DECISION_MAKING", "score": 0-10 }
  ],
  "overallScore": 0-10
}`;
  }

  private stub(modelVersion: string): GrokAnalysisResult {
    return {
      summary: 'Análise stub — configure GROK_API_KEY para análise real.',
      strengths: ['Boa leitura espacial', 'Decisão rápida'],
      weaknesses: ['Finalização poderia ser mais precisa'],
      attributeScores: [
        { attribute: Attribute.FINISHING, score: 7.0 },
        { attribute: Attribute.DRIBBLING, score: 7.5 },
        { attribute: Attribute.PASSING, score: 6.5 },
        { attribute: Attribute.VISION, score: 8.0 },
        { attribute: Attribute.PACE, score: 7.0 },
        { attribute: Attribute.POSITIONING, score: 7.5 },
      ],
      overallScore: 7.2,
      modelVersion: `${modelVersion}-stub`,
      raw: { stub: true },
    };
  }
}
