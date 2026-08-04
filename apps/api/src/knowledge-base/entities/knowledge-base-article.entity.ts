import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { EmbeddingStatus, KnowledgeBaseEntryType } from '@open-support/schemas/knowledge-base';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'knowledge_base_articles' })
export class KnowledgeBaseArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  @Column({ name: 'category_path', type: 'varchar', length: 500, nullable: true })
  categoryPath!: string | null;

  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 32, default: 'article' })
  type!: KnowledgeBaseEntryType;

  @Column({ name: 'content_html', type: 'text', nullable: true })
  contentHtml!: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  excerpt!: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  question!: string | null;

  @Column({ name: 'answer_html', type: 'text', nullable: true })
  answerHtml!: string | null;

  @Column({ name: 'search_text', type: 'text', nullable: true })
  searchText!: string | null;

  @Column({ name: 'embedding_model', type: 'varchar', length: 120, nullable: true })
  embeddingModel!: string | null;

  @Column({ name: 'embedding_dimensions', type: 'integer', nullable: true })
  embeddingDimensions!: number | null;

  @Column({ name: 'embedding_status', type: 'varchar', length: 32, default: 'pending' })
  embeddingStatus!: EmbeddingStatus;

  @Column({ name: 'embedded_at', type: 'timestamptz', nullable: true })
  embeddedAt!: Date | null;

  @Column({ type: 'boolean', default: false })
  published!: boolean;

  @Column({ type: 'boolean', default: false })
  featured!: boolean;

  @Column({ name: 'order', type: 'integer', default: 0 })
  order!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => ProductEntity, (product) => product.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.articles, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity;
}
