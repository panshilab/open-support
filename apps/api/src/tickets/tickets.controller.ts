import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  CreateTicketCommentDto,
  type CreateTicketCommentInput,
  CreateTicketDto,
  type CreateTicketInput,
  MarkTicketSeenDto,
  type MarkTicketSeenInput,
  TicketIdParamDto,
  UpdateTicketStatusDto,
  type UpdateTicketStatusInput,
} from '@open-support/schemas/ticket';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SessionGuard } from '../auth/session.guard';
import type { SessionUser } from '../auth/session.service';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@UseGuards(SessionGuard)
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get()
  list(@CurrentUser() user: SessionUser) {
    return this.tickets.listForUser(user);
  }

  @Post()
  create(@CurrentUser() user: SessionUser, @Body() body: CreateTicketDto) {
    return this.tickets.create(user, body as CreateTicketInput);
  }

  @Get(':ticketId')
  get(@CurrentUser() user: SessionUser, @Param() params: TicketIdParamDto) {
    return this.tickets.getForUser(params.ticketId, user);
  }

  @Post(':ticketId/comments')
  addComment(
    @CurrentUser() user: SessionUser,
    @Param() params: TicketIdParamDto,
    @Body() body: CreateTicketCommentDto,
  ) {
    return this.tickets.addComment(params.ticketId, user, body as CreateTicketCommentInput);
  }

  @Patch(':ticketId/seen')
  markSeen(
    @CurrentUser() user: SessionUser,
    @Param() params: TicketIdParamDto,
    @Body() body: MarkTicketSeenDto,
  ) {
    return this.tickets.markSeen(params.ticketId, user, body as MarkTicketSeenInput);
  }

  @Patch(':ticketId/status')
  @UseGuards(RolesGuard)
  @Roles('admin', 'support_agent')
  updateStatus(
    @CurrentUser() user: SessionUser,
    @Param() params: TicketIdParamDto,
    @Body() body: UpdateTicketStatusDto,
  ) {
    return this.tickets.updateStatus(params.ticketId, user, body as UpdateTicketStatusInput);
  }
}
