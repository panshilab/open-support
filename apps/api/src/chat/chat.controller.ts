import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ChatIdParamDto,
  ChatTokenDto,
  SendChatMessageDto,
  type SendChatMessageInput,
  StartChatDto,
  type StartChatInput,
  UpdateChatStatusDto,
  type UpdateChatStatusInput,
} from '@open-support/schemas/chat';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SessionGuard } from '../auth/session.guard';
import type { SessionUser } from '../auth/session.service';
import { ChatService } from './chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chats: ChatService) {}

  @Post()
  start(@Body() body: StartChatDto, @Req() request: Request) {
    return this.chats.start(body as StartChatInput, request.ip ?? null);
  }

  @Get('visitor/:chatId')
  getVisitor(@Param() params: ChatIdParamDto, @Query() query: ChatTokenDto) {
    return this.chats.visitorChat(params.chatId, query.token);
  }

  @Post('messages')
  sendVisitorMessage(@Body() body: SendChatMessageDto) {
    const input = body as SendChatMessageInput;
    if (!input.token) throw new BadRequestException('Chat token is required');
    return this.chats.sendVisitorMessage(input, input.token);
  }

  @Get('admin/list')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  listStaff() {
    return this.chats.listForStaff();
  }

  @Get('admin/:chatId')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  getStaff(@Param() params: ChatIdParamDto) {
    return this.chats.getForStaff(params.chatId);
  }

  @Post('admin/:chatId/messages')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  staffMessage(
    @CurrentUser() user: SessionUser,
    @Param() params: ChatIdParamDto,
    @Body() body: SendChatMessageDto,
  ) {
    return this.chats.staffMessage(params.chatId, user, body as SendChatMessageInput);
  }

  @Patch('admin/:chatId/status')
  @UseGuards(SessionGuard, RolesGuard)
  @Roles('admin', 'support_agent')
  updateStatus(
    @CurrentUser() user: SessionUser,
    @Param() params: ChatIdParamDto,
    @Body() body: UpdateChatStatusDto,
  ) {
    return this.chats.updateStatus(params.chatId, user, body as UpdateChatStatusInput);
  }
}
