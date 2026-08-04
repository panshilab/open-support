import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import type { StaffPresenceStatus } from '@open-support/schemas/dashboard';
import { UserEntity } from '../../users/user.entity';

@Entity({ name: 'staff_presence' })
export class StaffPresenceEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 32, default: 'online' })
  status!: StaffPresenceStatus;

  @Column({ name: 'last_seen_at', type: 'timestamptz' })
  lastSeenAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
