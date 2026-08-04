import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/user.entity';

@Entity({ name: 'admin_settings' })
export class AdminSettingEntity {
  @PrimaryColumn({ type: 'varchar', length: 120 })
  key!: string;

  @Column({ type: 'jsonb', default: {} })
  value!: Record<string, unknown>;

  @Column({ name: 'updated_by_user_id', type: 'uuid' })
  updatedByUserId!: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy!: UserEntity;
}
