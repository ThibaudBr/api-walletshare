import { Module } from '@nestjs/common';
import { ConversationController } from './web/conversation.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './domain/entities/conversation.entity';
import { JoinedConversationEntity } from './domain/entities/joined-conversation.entity';
import { MessageEntity } from './domain/entities/message.entity';
import { CardEntity } from '../card/domain/entities/card.entity';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { ConversationService } from './application/conversation.service';
import { GetAllConversationQueryHandler } from './application/cqrs/handler/query/get-all-conversation.query-handler';
import { GetAllConversationByProfilesAndCardQueryHandler } from './application/cqrs/handler/query/get-all-conversation-by-profiles-and-card.query-handler';
import { GetCardByIdForConversationQueryHandler } from './application/cqrs/handler/query/get-card-by-id-for-conversation.query-handler';
import { GetConversationByIdQueryHandler } from './application/cqrs/handler/query/get-conversation-by-id.query-handler';
import { GetConversationWhereUserConnectedQueryHandler } from './application/cqrs/handler/query/get-conversation-where-user-connected.query-handler';
import { GetUserAndProfileFromSocketQueryHandler } from './application/cqrs/handler/query/get-user-and-profile-from-socket.query-handler';
import { CreateConversationMessageEventHandler } from './application/cqrs/handler/event/create-conversation-message.event-handler';
import { CreateJoinedConversationEventHandler } from './application/cqrs/handler/event/create-joined-conversation.event-handler';
import { DeleteAllJoinedConversationEventHandler } from './application/cqrs/handler/event/delete-all-joined-conversation.event-handler';
import { DeleteJoinedConversationWithSocketIdEventHandler } from './application/cqrs/handler/event/delete-joined-conversation-with-socket-id.event-handler';
import { RemoveMessageConversationEventHandler } from './application/cqrs/handler/event/remove-message-conversation.event-handler';
import { SoftRemoveMessageConversationEventHandler } from './application/cqrs/handler/event/soft-remove-message-conversation.event-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, JoinedConversationEntity, MessageEntity, CardEntity]),
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
    GetAllConversationQueryHandler,
    GetAllConversationByProfilesAndCardQueryHandler,
    GetCardByIdForConversationQueryHandler,
    GetConversationByIdQueryHandler,
    GetConversationWhereUserConnectedQueryHandler,
    GetUserAndProfileFromSocketQueryHandler,
    // Events handlers
    CreateConversationMessageEventHandler,
    CreateJoinedConversationEventHandler,
    DeleteAllJoinedConversationEventHandler,
    DeleteJoinedConversationWithSocketIdEventHandler,
    RemoveMessageConversationEventHandler,
    SoftRemoveMessageConversationEventHandler,
  ],
})
export class ConversationModule {}
