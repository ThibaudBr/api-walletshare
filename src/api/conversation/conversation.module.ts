import { Module } from '@nestjs/common';
import { ConversationController } from './web/conversation.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './domain/entities/conversation.entity';
import { JoinedConversation } from './domain/entities/joined-conversation.entity';
import { MessageEntity } from './domain/entities/message.entity';
import { CardEntity } from '../card/domain/entities/card.entity';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { ConversationService } from './application/conversation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, JoinedConversation, MessageEntity, CardEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_LOG) || 3101 } },
    ]),
  ],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    // Query handlers
    // Events handlers
  ],
})
export class ConversationModule {}
