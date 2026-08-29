import { Body, Controller, Post } from '@nestjs/common';
import { AskAssistantDto, type AskAssistantInput } from '@open-support/schemas/assistant';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  @Post('message')
  ask(@Body() body: AskAssistantDto) {
    return this.assistant.ask(body as AskAssistantInput);
  }
}
