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
import { GetActiveConversationCountQueryHandler } from './application/cqrs/handler/query/get-active-conversation-count.query-handler';
import { AuthService } from '../auth/application/auth.service';
import { CreateConnectedUserCommandHandler } from './application/cqrs/handler/command/create-connected-user.command-handler';
import { RemoveAllConnectedUserCommandHandler } from './application/cqrs/handler/command/remove-all-connected-user.command-handler';
import { RemoveConnectedUserBySocketIdCommandHandler } from './application/cqrs/handler/command/remove-connected-user-by-socket-id.command-handler';
import { CreateConnectedUserEventHandler } from './application/cqrs/handler/event/create-connected-user.event-handler';
import { RemoveAllConnectedUserEventHandler } from './application/cqrs/handler/event/remove-all-connected-user.event-handler';
import { RemoveConnectedUserBySocketIdEventHandler } from './application/cqrs/handler/event/remove-connected-user-by-socket-id.event-handler';
import { ConnectedUserEntity } from './domain/entities/connected-user.entity';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './web/gateway/chat.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RemoveAllJoinedConversationWithSocketIdCommandHandler } from './application/cqrs/handler/command/remove-all-joined-conversation-with-socket-id.command-handler';
import { RemoveAllJoinedConversationWithSocketIdEventHandler } from './application/cqrs/handler/event/remove-all-joined-conversation-with-socket-id.event-handler';
import { NotificationEntity } from '../notification/domain/entities/notification.entity';
import { NotificationService } from '../notification/application/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { RemoveAllJoinedProfileByConversationIdCommandHandler } from './application/cqrs/handler/command/remove-all-joined-profile-by-conversation-id.command-handler';
import { RemoveAllJoinedProfileByConversationIdEventHandler } from './application/cqrs/handler/event/remove-all-joined-profile-by-conversation-id.event-handler';
import { GroupEntity } from '../groupe/domain/entities/group.entity';
import { GroupMembershipEntity } from '../groupe/domain/entities/group-membership.entity';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      ProfileEntity,
      ConversationEntity,
      JoinedConversationEntity,
      MessageEntity,
      CardEntity,
      MediaEntity,
      ConnectedUserEntity,
      NotificationEntity,
      GroupEntity,
      GroupMembershipEntity,
    ]),
    CqrsModule,
    ApiLogModule,
    HttpModule,
    AuthModule,
    NotificationModule,
  ],
  controllers: [ConversationController],
  providers: [
    AuthService,
    NotificationService,
    ChatGateway,
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
    CreateConnectedUserCommandHandler,
    RemoveAllConnectedUserCommandHandler,
    RemoveConnectedUserBySocketIdCommandHandler,
    RemoveAllJoinedConversationWithSocketIdCommandHandler,
    RemoveAllJoinedProfileByConversationIdCommandHandler,
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
    RemoveAllJoinedProfileByConversationIdEventHandler,
    AddMessageWithMediaEventHandler,
    CreateConversationMessageEventHandler,
    CreateJoinedConversationEventHandler,
    DeleteAllJoinedConversationEventHandler,
    DeleteJoinedConversationWithSocketIdEventHandler,
    RemoveMessageConversationEventHandler,
    SoftRemoveMessageConversationEventHandler,
    GetActiveConversationCountQueryHandler,
    CreateConnectedUserEventHandler,
    RemoveAllConnectedUserEventHandler,
    RemoveConnectedUserBySocketIdEventHandler,
    RemoveAllJoinedConversationWithSocketIdEventHandler,
    // imported from other modules
    UploadMediaCommandHandler,
    UploadMediaEventHandler,
    RemoveMediaCommandHandler,
    RemoveMediaEventHandler,
  ],
})
export class ConversationModule {}
