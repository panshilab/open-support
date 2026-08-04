import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  CreateCategoryInput,
  CreateProductInput,
  UpdateCategoryInput,
  UpdateProductInput,
} from '@open-support/schemas/category';
import type {
  BackfillKnowledgeBaseEmbeddingsInput,
  CreateKnowledgeBaseEntryInput,
  KnowledgeBaseSearchQuery,
  ListKnowledgeBaseArticlesQuery,
  UpdateKnowledgeBaseEntryInput,
} from '@open-support/schemas/knowledge-base';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { KnowledgeBaseArticleEntity } from './entities/knowledge-base-article.entity';
import { ProductEntity } from './entities/product.entity';
import { EmbeddingService } from './embedding.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly products: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categories: Repository<CategoryEntity>,
    @InjectRepository(KnowledgeBaseArticleEntity)
    private readonly articles: Repository<KnowledgeBaseArticleEntity>,
    private readonly embeddings: EmbeddingService,
  ) {}

  listProducts() {
    return this.products.find({ order: { order: 'ASC', name: 'ASC' } });
  }

  createProduct(input: CreateProductInput) {
    return this.products.save(this.products.create(input));
  }

  async updateProduct(productId: string, input: UpdateProductInput) {
    const product = await this.getProduct(productId);
    Object.assign(product, input);
    return this.products.save(product);
  }

  async createCategory(input: CreateCategoryInput) {
    const category = this.categories.create({
      ...input,
      parentId: input.parentId ?? null,
    });
    await this.applyCategoryPath(category);
    return this.categories.save(category);
  }

  async updateCategory(categoryId: string, input: UpdateCategoryInput) {
    const category = await this.getCategory(categoryId);
    Object.assign(category, input);
    await this.applyCategoryPath(category);
    return this.categories.save(category);
  }

  async listCategoryTree(productId?: string) {
    const categories = await this.categories.find({
      where: productId ? { productId } : {},
      order: { level: 'ASC', order: 'ASC', name: 'ASC' },
    });
    const byParent = new Map<string | null, CategoryEntity[]>();

    for (const category of categories) {
      const children = byParent.get(category.parentId) ?? [];
      children.push(category);
      byParent.set(category.parentId, children);
    }

    const build = (
      parentId: string | null,
    ): Array<CategoryEntity & { children: CategoryEntity[] }> =>
      (byParent.get(parentId) ?? []).map((category) =>
        Object.assign(category, { children: build(category.id) }),
      );

    return build(null);
  }

  async listArticles(query: ListKnowledgeBaseArticlesQuery, includeDrafts = false) {
    const page = Number(query.page);
    const limit = Number(query.limit);
    const builder = this.articles
      .createQueryBuilder('article')
      .orderBy('article.featured', 'DESC')
      .addOrderBy('article.order', 'ASC')
      .addOrderBy('article.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (!includeDrafts) {
      builder.where('article.published = true');
    }

    if (query.productId) {
      builder.andWhere('article.productId = :productId', { productId: query.productId });
    }

    if (query.categoryId) {
      builder.andWhere('article.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    const [items, total] = await builder.getManyAndCount();

    return {
      items,
      page,
      limit,
      total,
      nextPage: page * limit < total ? page + 1 : null,
    };
  }

  async getArticle(articleId: string, includeDrafts = false) {
    const article = await this.articles.findOne({ where: { id: articleId } });

    if (!article || (!includeDrafts && !article.published)) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async createArticle(input: CreateKnowledgeBaseEntryInput) {
    if (!input.productId || !input.categoryId) {
      throw new BadRequestException('Article product and category are required');
    }

    const category = await this.getCategory(input.categoryId);
    const article = this.articles.create({
      ...input,
      productId: input.productId,
      categoryId: input.categoryId,
      categoryPath: category.path,
      searchText: this.createSearchText(input, category.path),
      embeddingStatus: this.embeddings.enabled ? 'pending' : 'ready',
      embeddedAt: this.embeddings.enabled ? null : new Date(),
    });
    const saved = await this.articles.save(article);
    await this.refreshEmbedding(saved);
    return this.getArticle(saved.id, true);
  }

  async updateArticle(articleId: string, input: UpdateKnowledgeBaseEntryInput) {
    const article = await this.getArticle(articleId, true);
    const category = input.categoryId ? await this.getCategory(input.categoryId) : null;
    Object.assign(article, input);

    if (category) {
      article.productId = input.productId ?? category.productId;
      article.categoryId = category.id;
      article.categoryPath = category.path;
    }

    article.searchText = this.createSearchText(article, article.categoryPath);
    article.embeddingStatus = this.embeddings.enabled ? 'pending' : 'ready';
    const saved = await this.articles.save(article);
    await this.refreshEmbedding(saved);
    return this.getArticle(saved.id, true);
  }

  async backfillEmbeddings(input: BackfillKnowledgeBaseEmbeddingsInput) {
    if (!this.embeddings.enabled) {
      return {
        enabled: false,
        processed: 0,
        updated: 0,
        failed: 0,
        skipped: 0,
      };
    }

    const builder = this.articles
      .createQueryBuilder('article')
      .orderBy('article.updatedAt', 'DESC')
      .take(input.limit);

    if (!input.force) {
      builder.where(
        "(article.embeddingStatus != 'ready' OR article.embeddingStatus IS NULL OR article.embeddedAt IS NULL OR article.embedding IS NULL)",
      );
    }

    const articles = await builder.getMany();
    const result = {
      enabled: true,
      processed: articles.length,
      updated: 0,
      failed: 0,
      skipped: 0,
    };

    /* eslint-disable no-await-in-loop */
    for (const article of articles) {
      const category = article.categoryId ? await this.getCategory(article.categoryId) : null;
      article.categoryPath = category?.path ?? article.categoryPath;
      article.searchText = this.createSearchText(article, article.categoryPath);
      article.embeddingStatus = 'pending';
      await this.articles.save(article);

      const status = await this.refreshEmbedding(article);
      if (status === 'ready') {
        result.updated += 1;
      } else if (status === 'failed') {
        result.failed += 1;
      } else {
        result.skipped += 1;
      }
    }
    /* eslint-enable no-await-in-loop */

    return result;
  }

  async search(query: KnowledgeBaseSearchQuery) {
    if (this.embeddings.enabled) {
      const semanticResults = await this.semanticSearch(query);

      if (semanticResults.length > 0) {
        return {
          mode: 'vector' as const,
          results: semanticResults,
        };
      }
    }

    return {
      mode: 'text' as const,
      results: await this.textSearch(query),
    };
  }

  private async semanticSearch(query: KnowledgeBaseSearchQuery) {
    const embedding = await this.embeddings.embed(query.query);

    if (!embedding) {
      return [];
    }

    const filters: string[] = ['published = true', 'embedding IS NOT NULL'];
    const params: unknown[] = [this.embeddings.toSqlVector(embedding)];

    if (query.productId) {
      params.push(query.productId);
      filters.push(`product_id = $${params.length}`);
    }

    if (query.categoryId) {
      params.push(query.categoryId);
      filters.push(`category_id = $${params.length}`);
    }

    params.push(query.limit);
    const limitParam = params.length;
    params.push((query.page - 1) * query.limit);
    const offsetParam = params.length;

    return this.articles.query(
      `
        SELECT *, 1 - (embedding <=> $1::vector) AS score
        FROM knowledge_base_articles
        WHERE ${filters.join(' AND ')}
        ORDER BY embedding <=> $1::vector ASC
        LIMIT $${limitParam} OFFSET $${offsetParam}
      `,
      params,
    ) as Promise<KnowledgeBaseArticleEntity[]>;
  }

  private textSearch(query: KnowledgeBaseSearchQuery) {
    const builder = this.articles
      .createQueryBuilder('article')
      .where('article.published = true')
      .andWhere(
        '(article.searchText ILIKE :query OR article.name ILIKE :query OR article.question ILIKE :query)',
        { query: `%${query.query}%` },
      );

    if (query.productId) {
      builder.andWhere('article.productId = :productId', { productId: query.productId });
    }

    if (query.categoryId) {
      builder.andWhere('article.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    return builder
      .orderBy('article.featured', 'DESC')
      .addOrderBy('article.updatedAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();
  }

  private async refreshEmbedding(article: KnowledgeBaseArticleEntity) {
    if (!this.embeddings.enabled || !article.searchText) {
      return 'skipped' as const;
    }

    const embedding = await this.embeddings.embed(article.searchText);

    if (!embedding) {
      article.embeddingStatus = 'failed';
      await this.articles.save(article);
      return 'failed' as const;
    }

    await this.articles.query(
      `
        UPDATE knowledge_base_articles
        SET embedding = $1::vector,
            embedding_model = $2,
            embedding_dimensions = $3,
            embedding_status = 'ready',
            embedded_at = now()
        WHERE id = $4
      `,
      [this.embeddings.toSqlVector(embedding), this.embeddings.model, embedding.length, article.id],
    );
    return 'ready' as const;
  }

  private createSearchText(
    input: Partial<CreateKnowledgeBaseEntryInput> | KnowledgeBaseArticleEntity,
    categoryPath: string | null,
  ) {
    return [
      input.name,
      input.question,
      input.excerpt,
      input.contentHtml,
      input.answerHtml,
      categoryPath,
    ]
      .filter(Boolean)
      .join('\n')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private async applyCategoryPath(category: CategoryEntity) {
    if (!category.parentId) {
      category.path = category.name;
      category.level = 0;
      return;
    }

    const parent = await this.getCategory(category.parentId);
    category.path = `${parent.path} / ${category.name}`;
    category.level = parent.level + 1;
  }

  private async getProduct(productId: string) {
    const product = await this.products.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  private async getCategory(categoryId: string) {
    const category = await this.categories.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
