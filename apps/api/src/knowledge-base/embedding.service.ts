import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '../config/env.service';

interface OpenAiEmbeddingResponse {
  data: Array<{ embedding: number[] }>;
}

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(private readonly env: EnvService) {}

  get enabled() {
    return Boolean(this.env.openAi.apiKey);
  }

  get model() {
    return this.env.openAi.embeddingModel;
  }

  get dimensions() {
    return this.env.openAi.embeddingDimensions;
  }

  async embed(text: string) {
    const apiKey = this.env.openAi.apiKey;

    if (!apiKey) {
      return null;
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: this.model,
        dimensions: this.dimensions,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      this.logger.warn(`OpenAI embedding request failed: ${response.status} ${message}`);
      return null;
    }

    const json = (await response.json()) as OpenAiEmbeddingResponse;
    return json.data[0]?.embedding ?? null;
  }

  toSqlVector(embedding: number[]) {
    return `[${embedding.join(',')}]`;
  }
}
