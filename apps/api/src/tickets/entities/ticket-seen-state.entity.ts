import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { TicketEntity } from './ticket.entity';

@Entity({ name: 'ticket_seen_states' })
export class TicketSeenStateEntity {
  @PrimaryColumn({ name: 'ticket_id', type: 'uuid' })
  ticketId!: string;

  @Column({ name: 'customer_seen_at', type: 'timestamptz', nullable: true })
  customerSeenAt!: Date | null;

  @Column({ name: 'staff_seen_at', type: 'timestamptz', nullable: true })
  staffSeenAt!: Date | null;

  @OneToOne(() => TicketEntity, (ticket) => ticket.seenState, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket!: TicketEntity;
}
