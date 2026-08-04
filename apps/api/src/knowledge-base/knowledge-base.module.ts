import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { KnowledgeBaseArticleEntity } from './entities/knowledge-base-article.entity';
import { ProductEntity } from './entities/product.entity';
import { EmbeddingService } from './embedding.service';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { KnowledgeBaseService } from './knowledge-base.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, KnowledgeBaseArticleEntity]),
  ],
  controllers: [KnowledgeBaseController],
  providers: [EmbeddingService, KnowledgeBaseService],
  exports: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
