import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  CategoryIdParamDto,
  CreateCategoryDto,
  CreateProductDto,
  ProductIdParamDto,
  UpdateCategoryDto,
  UpdateProductDto,
  type CreateCategoryInput,
  type CreateProductInput,
  type UpdateCategoryInput,
  type UpdateProductInput,
} from '@open-support/schemas/category';
import {
  BackfillKnowledgeBaseEmbeddingsDto,
  CreateKnowledgeBaseEntryDto,
  KnowledgeBaseEntryIdParamDto,
  KnowledgeBaseSearchQueryDto,
  UpdateKnowledgeBaseEntryDto,
  type BackfillKnowledgeBaseEmbeddingsInput,
  type CreateKnowledgeBaseEntryInput,
  type KnowledgeBaseSearchQuery,
  type UpdateKnowledgeBaseEntryInput,
} from '@open-support/schemas/knowledge-base';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SessionGuard } from '../auth/session.guard';
import { KnowledgeBaseService } from './knowledge-base.service';

@Controller('knowledgebase')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBase: KnowledgeBaseService) {}

  @Get('products')
  listProducts() {
    return this.knowledgeBase.listProducts();
  }

  @Get('categories')
  listCategoryTree(@Query('productId') productId?: string) {
    return this.knowledgeBase.listCategoryTree(productId);
  }

  @Get('articles')
  listArticles() {
    return this.knowledgeBase.listArticles();
  }

  @Get('search')
  search(@Query() query: KnowledgeBaseSearchQueryDto) {
    return this.knowledgeBase.search(query as KnowledgeBaseSearchQuery);
  }

  @Get('articles/:articleId')
  getArticle(@Param() params: KnowledgeBaseEntryIdParamDto) {
    return this.knowledgeBase.getArticle(params.articleId);
  }

  @Post('admin/products')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  createProduct(@Body() body: CreateProductDto) {
    return this.knowledgeBase.createProduct(body as CreateProductInput);
  }

  @Patch('admin/products/:productId')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  updateProduct(@Param() params: ProductIdParamDto, @Body() body: UpdateProductDto) {
    return this.knowledgeBase.updateProduct(params.productId, body as UpdateProductInput);
  }

  @Post('admin/categories')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  createCategory(@Body() body: CreateCategoryDto) {
    return this.knowledgeBase.createCategory(body as CreateCategoryInput);
  }

  @Patch('admin/categories/:categoryId')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  updateCategory(@Param() params: CategoryIdParamDto, @Body() body: UpdateCategoryDto) {
    return this.knowledgeBase.updateCategory(params.categoryId, body as UpdateCategoryInput);
  }

  @Post('admin/articles')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  createArticle(@Body() body: CreateKnowledgeBaseEntryDto) {
    return this.knowledgeBase.createArticle(body as CreateKnowledgeBaseEntryInput);
  }

  @Post('admin/articles/backfill-embeddings')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin')
  backfillEmbeddings(@Body() body: BackfillKnowledgeBaseEmbeddingsDto) {
    return this.knowledgeBase.backfillEmbeddings(body as BackfillKnowledgeBaseEmbeddingsInput);
  }

  @Patch('admin/articles/:articleId')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  updateArticle(
    @Param() params: KnowledgeBaseEntryIdParamDto,
    @Body() body: UpdateKnowledgeBaseEntryDto,
  ) {
    return this.knowledgeBase.updateArticle(
      params.articleId,
      body as UpdateKnowledgeBaseEntryInput,
    );
  }
}
