import { Module } from '@nestjs/common';
import { AppConfigModule } from '../config/config.module';
import { KnowledgeBaseModule } from '../knowledge-base/knowledge-base.module';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';

@Module({
  imports: [AppConfigModule, KnowledgeBaseModule],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
