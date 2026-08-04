import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { UserRole } from '@open-support/schemas/user';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  name!: string | null;

  @Column({ type: 'varchar', length: 32, default: 'user' })
  role!: UserRole;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  passwordHash!: string | null;

  @Column({ name: 'must_change_password', type: 'boolean', default: false })
  mustChangePassword!: boolean;

  @Column({ name: 'receive_email_notifications', type: 'boolean', default: true })
  receiveEmailNotifications!: boolean;

  @Column({ name: 'receive_new_ticket_emails', type: 'boolean', default: true })
  receiveNewTicketEmails!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
