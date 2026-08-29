import { randomBytes } from 'node:crypto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  SendChatMessageInput,
  StartChatInput,
  UpdateChatStatusInput,
} from '@open-support/schemas/chat';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import type { SessionUser } from '../auth/session.service';
import { ChatEntity } from './entities/chat.entity';
import { ChatMessageEntity } from './entities/chat-message.entity';
import { ChatMetaEntity } from './entities/chat-meta.entity';

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity) private readonly chats: Repository<ChatEntity>,
    @InjectRepository(ChatMessageEntity) private readonly messages: Repository<ChatMessageEntity>,
    @InjectRepository(ChatMetaEntity) private readonly meta: Repository<ChatMetaEntity>,
    private readonly cache: CacheService,
  ) {}

  async start(input: StartChatInput, ipAddress: string | null) {
    const chat = await this.chats.save(
      this.chats.create({
        visitorEmail: input.visitorEmail,
        visitorName: input.visitorName,
        status: 'waiting',
        staffUserId: null,
        staffName: null,
        botActive: false,
      }),
    );
    if (input.meta || ipAddress) {
      await this.meta.save(this.meta.create({ chatId: chat.id, ...input.meta, ipAddress }));
    }
    const token = randomBytes(32).toString('hex');
    await this.cache.set(
      this.tokenKey(token),
      { chatId: chat.id },
      { ttlSeconds: TOKEN_TTL_SECONDS },
    );
    await this.addVisitorMessage(chat.id, input.message, input.visitorName, input.visitorEmail);
    return { chat: await this.getChat(chat.id), token };
  }

  async visitorChat(chatId: string, token: string) {
    await this.assertVisitor(chatId, token);
    return this.getChat(chatId);
  }

  async addVisitorMessage(
    chatId: string,
    content: string,
    name: string,
    email: string,
    token?: string,
  ) {
    if (token) await this.assertVisitor(chatId, token);
    const chat = await this.getChatEntity(chatId);
    if (chat.status === 'closed') throw new ForbiddenException('Chat is closed');
    const message = await this.messages.save(
      this.messages.create({
        chatId,
        sender: 'visitor',
        senderEmail: email,
        senderName: name,
        content,
        staffOnly: false,
      }),
    );
    await this.chats.update(chatId, {
      updatedAt: new Date(),
      status: chat.status === 'waiting' ? 'waiting' : 'active',
    });
    return message;
  }

  async sendVisitorMessage(input: SendChatMessageInput, token: string) {
    const chat = await this.assertVisitorToken(token);
    return this.addVisitorMessage(
      chat.id,
      input.content,
      chat.visitorName,
      chat.visitorEmail,
      token,
    );
  }

  async listForStaff() {
    return this.chats.find({ order: { updatedAt: 'DESC' } });
  }

  async getForStaff(chatId: string) {
    return this.getChat(chatId);
  }

  async staffMessage(chatId: string, user: SessionUser, input: SendChatMessageInput) {
    const chat = await this.getChatEntity(chatId);
    if (chat.status === 'closed') throw new ForbiddenException('Chat is closed');
    await this.chats.update(chatId, {
      status: 'active',
      staffUserId: user.id,
      staffName: user.name ?? user.email,
      updatedAt: new Date(),
    });
    return this.messages.save(
      this.messages.create({
        chatId,
        sender: 'staff',
        senderEmail: user.email,
        senderName: user.name ?? user.email,
        content: input.content,
        staffOnly: false,
      }),
    );
  }

  async updateStatus(chatId: string, user: SessionUser, input: UpdateChatStatusInput) {
    const chat = await this.getChatEntity(chatId);
    await this.chats.update(chatId, {
      status: input.status,
      staffUserId: user.id,
      staffName: user.name ?? user.email,
      updatedAt: new Date(),
    });
    return this.getChat(chat.id);
  }

  private async getChat(chatId: string) {
    const chat = await this.getChatEntity(chatId);
    const [messages, meta] = await Promise.all([
      this.messages.find({ where: { chatId }, order: { createdAt: 'ASC' } }),
      this.meta.findOne({ where: { chatId } }),
    ]);
    return { ...chat, messages, meta };
  }

  private async getChatEntity(chatId: string) {
    const chat = await this.chats.findOne({ where: { id: chatId } });
    if (!chat) throw new NotFoundException('Chat not found');
    return chat;
  }

  private async assertVisitor(chatId: string, token: string) {
    const stored = await this.cache.get<{ chatId: string }>(this.tokenKey(token));
    if (!stored || stored.chatId !== chatId) throw new UnauthorizedException('Invalid chat token');
    return this.getChatEntity(chatId);
  }

  private async assertVisitorToken(token: string) {
    const stored = await this.cache.get<{ chatId: string }>(this.tokenKey(token));
    if (!stored) throw new UnauthorizedException('Invalid chat token');
    return this.getChatEntity(stored.chatId);
  }

  private tokenKey(token: string) {
    return `chat:visitor-token:${token}`;
  }
}
