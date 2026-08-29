import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  CreateTicketCommentInput,
  CreateTicketInput,
  MarkTicketSeenInput,
  UpdateTicketStatusInput,
} from '@open-support/schemas/ticket';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../knowledge-base/entities/category.entity';
import type { SessionUser } from '../auth/session.service';
import { TicketCommentEntity } from './entities/ticket-comment.entity';
import { TicketSeenStateEntity } from './entities/ticket-seen-state.entity';
import { TicketEntity } from './entities/ticket.entity';
import { RealtimePublisher } from '../realtime/realtime.publisher';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly tickets: Repository<TicketEntity>,
    @InjectRepository(TicketCommentEntity)
    private readonly comments: Repository<TicketCommentEntity>,
    @InjectRepository(TicketSeenStateEntity)
    private readonly seenStates: Repository<TicketSeenStateEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categories: Repository<CategoryEntity>,
    private readonly realtime: RealtimePublisher,
  ) {}

  async create(user: SessionUser, input: CreateTicketInput) {
    const category = await this.getCategory(input.categoryId);
    const ticket = await this.tickets.save(
      this.tickets.create({
        userId: user.id,
        productId: input.productId ?? category.productId,
        categoryId: category.id,
        categoryPath: category.path,
        title: input.title,
        descriptionHtml: input.descriptionHtml,
        status: 'open',
      }),
    );

    await this.comments.save(
      this.comments.create({
        ticketId: ticket.id,
        authorUserId: user.id,
        authorEmail: user.email,
        contentHtml: input.descriptionHtml,
        isStaff: false,
      }),
    );
    await this.seenStates.save(
      this.seenStates.create({
        ticketId: ticket.id,
        customerSeenAt: new Date(),
        staffSeenAt: null,
      }),
    );

    this.realtime.publish({
      type: 'ticket.created',
      ticketId: ticket.id,
      ticketOwnerId: user.id,
      actorId: user.id,
      actorRole: user.role,
      status: ticket.status,
      occurredAt: new Date().toISOString(),
    });

    return this.getForUser(ticket.id, user);
  }

  listForUser(user: SessionUser) {
    if (this.isStaff(user)) {
      return this.tickets.find({ order: { updatedAt: 'DESC' } });
    }

    return this.tickets.find({ where: { userId: user.id }, order: { updatedAt: 'DESC' } });
  }

  async getForUser(ticketId: string, user: SessionUser) {
    const ticket = await this.tickets.findOne({
      where: { id: ticketId },
      relations: { comments: true, seenState: true },
      order: { comments: { createdAt: 'ASC' } },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (!this.isStaff(user) && ticket.userId !== user.id) {
      throw new ForbiddenException('Ticket access denied');
    }

    return ticket;
  }

  async addComment(ticketId: string, user: SessionUser, input: CreateTicketCommentInput) {
    const ticket = await this.getForUser(ticketId, user);
    const isStaff = this.isStaff(user);
    await this.comments.save(
      this.comments.create({
        ticketId: ticket.id,
        authorUserId: user.id,
        authorEmail: user.email,
        contentHtml: input.contentHtml,
        isStaff,
      }),
    );

    await this.tickets.update(ticket.id, {
      status: isStaff ? 'replied' : 'customer_reply',
    });
    await this.markSeen(ticket.id, user, { side: isStaff ? 'staff' : 'customer' });
    this.realtime.publish({
      type: 'ticket.comment_added',
      ticketId: ticket.id,
      ticketOwnerId: ticket.userId,
      actorId: user.id,
      actorRole: user.role,
      status: isStaff ? 'replied' : 'customer_reply',
      occurredAt: new Date().toISOString(),
    });
    return this.getForUser(ticket.id, user);
  }

  async updateStatus(ticketId: string, user: SessionUser, input: UpdateTicketStatusInput) {
    const ticket = await this.get(ticketId);
    ticket.status = input.status;
    const saved = await this.tickets.save(ticket);
    this.realtime.publish({
      type: 'ticket.status_updated',
      ticketId: saved.id,
      ticketOwnerId: saved.userId,
      actorId: user.id,
      actorRole: user.role,
      status: saved.status,
      occurredAt: new Date().toISOString(),
    });
    return saved;
  }

  async markSeen(ticketId: string, user: SessionUser, input: MarkTicketSeenInput) {
    await this.getForUser(ticketId, user);
    const seenState =
      (await this.seenStates.findOne({ where: { ticketId } })) ??
      this.seenStates.create({ ticketId, customerSeenAt: null, staffSeenAt: null });

    if (input.side === 'staff') {
      seenState.staffSeenAt = new Date();
    } else {
      seenState.customerSeenAt = new Date();
    }

    const saved = await this.seenStates.save(seenState);
    const ticket = await this.get(ticketId);
    this.realtime.publish({
      type: 'ticket.seen_updated',
      ticketId,
      ticketOwnerId: ticket.userId,
      actorId: user.id,
      actorRole: user.role,
      side: input.side,
      occurredAt: new Date().toISOString(),
    });
    return saved;
  }

  private async get(ticketId: string) {
    const ticket = await this.tickets.findOne({ where: { id: ticketId } });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  private async getCategory(categoryId: string) {
    const category = await this.categories.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  private isStaff(user: SessionUser) {
    return user.role === 'admin' || user.role === 'support_agent';
  }
}
