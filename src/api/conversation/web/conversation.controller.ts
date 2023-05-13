import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConversationService } from '../application/conversation.service';

@Controller('conversation')
@ApiTags('Conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
}
