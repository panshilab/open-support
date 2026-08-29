import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type {
  AskAssistantInput,
  AssistantResponse,
  AssistantSource,
} from '@open-support/schemas/assistant';
import { EnvService } from '../config/env.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import { AiConfigService } from '../admin-ops/ai-config.service';

interface OpenAiResponse {
  output_text?: string;
}

interface AnthropicResponse {
  content?: Array<{ type?: string; text?: string }>;
}

interface SearchArticle {
  answerHtml?: string | null;
  categoryPath?: string | null;
  contentHtml?: string | null;
  excerpt?: string | null;
  id: string;
  name?: string | null;
  question?: string | null;
  type?: string | null;
}

@Injectable()
export class AssistantService {
  constructor(
    private readonly env: EnvService,
    private readonly knowledgeBase: KnowledgeBaseService,
    private readonly aiConfig: AiConfigService,
  ) {}

  async ask(input: AskAssistantInput): Promise<AssistantResponse> {
    const search = await this.knowledgeBase.search({
      categoryId: undefined,
      limit: 5,
      page: 1,
      productId: undefined,
      query: input.message,
    });
    const sources = search.results.map((article) => this.toSource(article));

    if (sources.length === 0) {
      return {
        answer:
          'I could not find a reliable answer in the support center yet. A support teammate can take a closer look at your request.',
        confidence: 'low',
        shouldEscalate: true,
        sources: [],
      };
    }

    const configured = await this.aiConfig.getConfig();
    const apiKey = configured?.enabled ? configured.apiKey : this.env.openAi.apiKey;
    const model = configured?.enabled
      ? (configured.model ??
        (configured.provider === 'anthropic'
          ? 'claude-sonnet-4-20250514'
          : this.env.openAi.assistantModel))
      : this.env.openAi.assistantModel;
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'Automated support is not configured. Please open a support ticket instead.',
      );
    }

    if (configured?.enabled && configured.provider === 'anthropic') {
      return this.askAnthropic(input, search.results, sources, apiKey, model);
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      body: JSON.stringify({
        input: [
          ...input.history,
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: this.buildPrompt(input.message, search.results, sources),
              },
            ],
          },
        ],
        max_output_tokens: 600,
        model,
        store: false,
        text: {
          format: {
            type: 'json_schema',
            name: 'support_answer',
            strict: true,
            schema: {
              additionalProperties: false,
              properties: {
                answer: { type: 'string' },
                confidence: { enum: ['low', 'medium', 'high'], type: 'string' },
                shouldEscalate: { type: 'boolean' },
                sourceIds: { items: { type: 'string' }, type: 'array' },
              },
              required: ['answer', 'confidence', 'shouldEscalate', 'sourceIds'],
              type: 'object',
            },
          },
        },
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const message = await response.text();
      throw new ServiceUnavailableException(`Automated support request failed: ${message}`);
    }

    const payload = (await response.json()) as OpenAiResponse;
    const parsed = this.parseModelAnswer(payload.output_text);
    const selectedSources = sources.filter((source) => parsed.sourceIds.includes(source.id));
    const groundedSources = selectedSources.length > 0 ? selectedSources : sources.slice(0, 3);

    return {
      answer: parsed.answer,
      confidence: parsed.confidence,
      shouldEscalate: parsed.shouldEscalate || parsed.confidence === 'low',
      sources: groundedSources,
    };
  }

  private async askAnthropic(
    input: AskAssistantInput,
    articles: SearchArticle[],
    sources: AssistantSource[],
    apiKey: string,
    model: string,
  ): Promise<AssistantResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      body: JSON.stringify({
        max_tokens: 600,
        messages: [
          ...input.history,
          { role: 'user', content: this.buildPrompt(input.message, articles, sources) },
        ],
        model: model || 'claude-sonnet-4-20250514',
        system:
          'Return only valid JSON with keys answer, confidence, shouldEscalate, and sourceIds. Do not wrap it in markdown.',
      }),
      headers: {
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new ServiceUnavailableException(`Claude request failed: ${await response.text()}`);
    }

    const payload = (await response.json()) as AnthropicResponse;
    const text = payload.content?.find((item) => item.type === 'text')?.text;
    const parsed = this.parseModelAnswer(text);
    const selectedSources = sources.filter((source) => parsed.sourceIds.includes(source.id));
    return {
      answer: parsed.answer,
      confidence: parsed.confidence,
      shouldEscalate: parsed.shouldEscalate || parsed.confidence === 'low',
      sources: selectedSources.length > 0 ? selectedSources : sources.slice(0, 3),
    };
  }

  private buildPrompt(message: string, articles: SearchArticle[], sources: AssistantSource[]) {
    const context = articles
      .map((article, index) => {
        const source = sources[index];
        return `[${source.id}] ${source.title}\n${String(article.excerpt ?? '')}\n${String(article.contentHtml ?? article.answerHtml ?? '')}`;
      })
      .join('\n\n');

    return `You are Open Support's automated support guide. Answer only from the published support-center context below. If the context does not clearly answer the user's request, say so and set confidence to low. Never invent product behavior, policies, links, or steps. Keep the answer concise and actionable. Return sourceIds only for sources that support the answer.\n\nUser request: ${message}\n\nSupport-center context:\n${context}`;
  }

  private parseModelAnswer(value: string | undefined) {
    if (!value) {
      return {
        answer: 'I could not form a reliable answer from the support center.',
        confidence: 'low' as const,
        shouldEscalate: true,
        sourceIds: [],
      };
    }

    try {
      const parsed = JSON.parse(value) as {
        answer?: unknown;
        confidence?: unknown;
        shouldEscalate?: unknown;
        sourceIds?: unknown;
      };
      if (
        typeof parsed.answer !== 'string' ||
        !['low', 'medium', 'high'].includes(String(parsed.confidence))
      ) {
        throw new Error('Invalid assistant response');
      }
      return {
        answer: parsed.answer,
        confidence: parsed.confidence as 'low' | 'medium' | 'high',
        shouldEscalate: parsed.shouldEscalate === true,
        sourceIds: Array.isArray(parsed.sourceIds)
          ? parsed.sourceIds.filter((id): id is string => typeof id === 'string')
          : [],
      };
    } catch {
      return {
        answer: 'I could not form a reliable answer from the support center.',
        confidence: 'low' as const,
        shouldEscalate: true,
        sourceIds: [],
      };
    }
  }

  private toSource(article: SearchArticle): AssistantSource {
    return {
      categoryPath: typeof article.categoryPath === 'string' ? article.categoryPath : null,
      id: String(article.id),
      title: String(article.name ?? article.question ?? 'Support article'),
      type: String(article.type ?? 'article'),
    };
  }
}
