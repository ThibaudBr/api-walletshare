import { Module } from '@nestjs/common';
import { ConversationController } from './web/conversation.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
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
import { MediaEntity } from '../media/domain/entities/media.entity';
import { UploadMediaCommandHandler } from '../media/application/cqrs/handler/command/upload-media.command-handler';
import { UploadMediaEventHandler } from '../media/application/cqrs/handler/event/upload-media.event-handler';
import { RemoveMediaCommandHandler } from '../media/application/cqrs/handler/command/remove-media-command.handler';
import { RemoveMediaEventHandler } from '../media/application/cqrs/handler/event/remove-media-event.handler';
import { GetMessageFromConversationQueryHandler } from './application/cqrs/handler/query/get-message-from-conversation.query-handler';
import { IsUserIdOwnerOfMessageQueryHandler } from './application/cqrs/handler/query/is-user-id-owner-of-message.query-handler';
import { AddMessageWithMediaCommandHandler } from './application/cqrs/handler/command/add-message-with-media.command-handler';
import { CreateConversationMessageCommandHandler } from './application/cqrs/handler/command/create-conversation-message.command-handler';
import { CreateJoinedConversationCommandHandler } from './application/cqrs/handler/command/create-joined-conversation.command-handler';
import { DeleteAllJoinedConversationCommandHandler } from './application/cqrs/handler/command/delete-all-joined-conversation.command-handler';
import { DeleteJoinedConversationCommandHandler } from './application/cqrs/handler/command/delete-joined-conversation.command-handler';
import { RemoveMessageConversationCommandHandler } from './application/cqrs/handler/command/remove-message-conversation.command-handler';
import { SoftRemoveMessageConversationCommandHandler } from './application/cqrs/handler/command/soft-remove-message-conversation.command-handler';
import { AddMessageWithMediaEventHandler } from './application/cqrs/handler/event/add-message-with-media-event.handler';
import { UserEntity } from '../user/domain/entities/user.entity';
import { ProfileEntity } from '../profile/domain/entities/profile.entity';
import { HttpModule } from '@nestjs/axios';
import {
  GetActiveConversationCountQueryHandler
} from "./application/cqrs/handler/query/get-active-conversation-count.query-handler";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfileEntity,
      ConversationEntity,
      JoinedConversationEntity,
      MessageEntity,
      CardEntity,
      MediaEntity,
    ]),
    CqrsModule,
    ApiLogModule,
    HttpModule,
  ],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    AddMessageWithMediaCommandHandler,
    CreateConversationMessageCommandHandler,
    CreateJoinedConversationCommandHandler,
    DeleteAllJoinedConversationCommandHandler,
    DeleteJoinedConversationCommandHandler,
    RemoveMessageConversationCommandHandler,
    SoftRemoveMessageConversationCommandHandler,
    // Query handlers
    GetAllConversationQueryHandler,
    GetAllConversationByProfilesAndCardQueryHandler,
    GetCardByIdForConversationQueryHandler,
    GetConversationByIdQueryHandler,
    GetConversationWhereUserConnectedQueryHandler,
    GetUserAndProfileFromSocketQueryHandler,
    GetMessageFromConversationQueryHandler,
    IsUserIdOwnerOfMessageQueryHandler,
    // Events handlers
    AddMessageWithMediaEventHandler,
    CreateConversationMessageEventHandler,
    CreateJoinedConversationEventHandler,
    DeleteAllJoinedConversationEventHandler,
    DeleteJoinedConversationWithSocketIdEventHandler,
    RemoveMessageConversationEventHandler,
    SoftRemoveMessageConversationEventHandler,
    GetActiveConversationCountQueryHandler,
    // imported from other modules
    UploadMediaCommandHandler,
    UploadMediaEventHandler,
    RemoveMediaCommandHandler,
    RemoveMediaEventHandler,
  ],
})
export class ConversationModule {}
