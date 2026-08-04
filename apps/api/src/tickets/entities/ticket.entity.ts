import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TicketStatus } from '@open-support/schemas/ticket';
import { CategoryEntity } from '../../knowledge-base/entities/category.entity';
import { ProductEntity } from '../../knowledge-base/entities/product.entity';
import { UserEntity } from '../../users/user.entity';
import { TicketCommentEntity } from './ticket-comment.entity';
import { TicketSeenStateEntity } from './ticket-seen-state.entity';

@Entity({ name: 'tickets' })
export class TicketEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId!: string | null;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  @Column({ name: 'category_path', type: 'varchar', length: 500 })
  categoryPath!: string;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({ name: 'description_html', type: 'text' })
  descriptionHtml!: string;

  @Column({ type: 'varchar', length: 32, default: 'open' })
  status!: TicketStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => ProductEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity | null;

  @ManyToOne(() => CategoryEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity;

  @OneToMany(() => TicketCommentEntity, (comment) => comment.ticket)
  comments!: TicketCommentEntity[];

  @OneToOne(() => TicketSeenStateEntity, (seenState) => seenState.ticket)
  seenState!: TicketSeenStateEntity;
}
