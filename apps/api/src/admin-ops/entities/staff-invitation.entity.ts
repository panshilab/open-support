import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { UserRole } from '@open-support/schemas/user';

@Entity({ name: 'staff_invitations' })
export class StaffInvitationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 32, default: 'support_agent' })
  role!: Extract<UserRole, 'support_agent' | 'admin'>;

  @Column({ name: 'token_hash', type: 'varchar', length: 255, unique: true })
  tokenHash!: string;

  @Column({ name: 'invited_by_user_id', type: 'uuid' })
  invitedByUserId!: string;

  @Column({ name: 'accepted_by_user_id', type: 'uuid', nullable: true })
  acceptedByUserId!: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'accepted_at', type: 'timestamptz', nullable: true })
  acceptedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
