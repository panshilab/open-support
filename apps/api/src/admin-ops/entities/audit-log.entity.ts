import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { AuditAction } from '@open-support/schemas/dashboard';

@Entity({ name: 'audit_logs' })
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'actor_user_id', type: 'uuid' })
  actorUserId!: string;

  @Column({ name: 'actor_email', type: 'varchar', length: 255 })
  actorEmail!: string;

  @Column({ type: 'varchar', length: 80 })
  action!: AuditAction;

  @Column({ name: 'target_type', type: 'varchar', length: 80 })
  targetType!: string;

  @Column({ name: 'target_id', type: 'varchar', length: 160, nullable: true })
  targetId!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
