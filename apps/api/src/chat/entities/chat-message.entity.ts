import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { ChatSender } from '@open-support/schemas/chat';
import { ChatEntity } from './chat.entity';

@Entity({ name: 'chat_messages' })
export class ChatMessageEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'chat_id', type: 'uuid' }) chatId!: string;
  @Column({ type: 'varchar', length: 32 }) sender!: ChatSender;
  @Column({ name: 'sender_email', type: 'varchar', length: 255, nullable: true }) senderEmail!:
    | string
    | null;
  @Column({ name: 'sender_name', type: 'varchar', length: 120 }) senderName!: string;
  @Column({ type: 'text' }) content!: string;
  @Column({ name: 'staff_only', type: 'boolean', default: false }) staffOnly!: boolean;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @ManyToOne(() => ChatEntity, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat!: ChatEntity;
}
