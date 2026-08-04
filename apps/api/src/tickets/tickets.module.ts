import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../knowledge-base/entities/category.entity';
import { TicketCommentEntity } from './entities/ticket-comment.entity';
import { TicketSeenStateEntity } from './entities/ticket-seen-state.entity';
import { TicketEntity } from './entities/ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TicketEntity,
      TicketCommentEntity,
      TicketSeenStateEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
