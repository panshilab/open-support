import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ChatStatus } from '@open-support/schemas/chat';
import { ChatMessageEntity } from './chat-message.entity';
import { ChatMetaEntity } from './chat-meta.entity';

@Entity({ name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'visitor_email', type: 'varchar', length: 255 }) visitorEmail!: string;
  @Column({ name: 'visitor_name', type: 'varchar', length: 120 }) visitorName!: string;
  @Column({ type: 'varchar', length: 32, default: 'waiting' }) status!: ChatStatus;
  @Column({ name: 'staff_user_id', type: 'uuid', nullable: true }) staffUserId!: string | null;
  @Column({ name: 'staff_name', type: 'varchar', length: 120, nullable: true }) staffName!:
    | string
    | null;
  @Column({ name: 'bot_active', type: 'boolean', default: false }) botActive!: boolean;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
  @OneToMany(() => ChatMessageEntity, (message) => message.chat) messages!: ChatMessageEntity[];
  @OneToOne(() => ChatMetaEntity, (meta) => meta.chat) meta!: ChatMetaEntity;
}
