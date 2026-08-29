import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ChatEntity } from './chat.entity';

@Entity({ name: 'chat_meta' })
export class ChatMetaEntity {
  @PrimaryColumn({ name: 'chat_id', type: 'uuid' }) chatId!: string;
  @Column({ name: 'current_page', type: 'varchar', length: 2048, nullable: true }) currentPage!:
    | string
    | null;
  @Column({ name: 'ip_address', type: 'varchar', length: 80, nullable: true }) ipAddress!:
    | string
    | null;
  @Column({ type: 'varchar', length: 120, nullable: true }) timezone!: string | null;
  @Column({ type: 'varchar', length: 120, nullable: true }) browser!: string | null;
  @Column({ type: 'varchar', length: 120, nullable: true }) os!: string | null;
  @Column({ type: 'varchar', length: 80, nullable: true }) language!: string | null;
  @OneToOne(() => ChatEntity, (chat) => chat.meta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat!: ChatEntity;
}
