import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppCacheModule } from '../cache/cache.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatEntity } from './entities/chat.entity';
import { ChatMessageEntity } from './entities/chat-message.entity';
import { ChatMetaEntity } from './entities/chat-meta.entity';

@Module({
  imports: [
    AppCacheModule,
    TypeOrmModule.forFeature([ChatEntity, ChatMessageEntity, ChatMetaEntity]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
