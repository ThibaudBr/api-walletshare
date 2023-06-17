import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { ProfileEntity } from '../profile/domain/entities/profile.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { GroupEntity } from '../groupe/domain/entities/group.entity';
import { GroupMembershipEntity } from '../groupe/domain/entities/group-membership.entity';
import { NotificationEntity } from './domain/entities/notification.entity';
import { NotificationController } from './web/notification.controller';
import { NotificationService } from './application/notification.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { CreateNotificationAdminCommandHandler } from './application/cqrs/handler/command/create-notification-admin.command-handler';
import { MarkNotificationAsReadCommandHandler } from './application/cqrs/handler/command/mark-notification-as-read.command-handler';
import { RemoveNotificationCommandHandler } from './application/cqrs/handler/command/remove-notification.command-handler';
import { SoftRemoveNotificationCommandHandler } from './application/cqrs/handler/command/soft-remove-notification.command-handler';
import { GetAllNotificationQueryHandler } from './application/cqrs/handler/query/get-all-notification.query-handler';
import { GetAllNotificationWithUserIdQueryHandler } from './application/cqrs/handler/query/get-all-notification-with-user-id.query-handler';
import { GetAllUnreadNotificationWithUserIdQueryHandler } from './application/cqrs/handler/query/get-all-unread-notification-with-user-id.query-handler';
import { GetNotificationByIdQueryHandler } from './application/cqrs/handler/query/get-notification-by-id.query-handler';
import { CreateNotificationAdminEventHandler } from './application/cqrs/handler/event/create-notification-admin.event-handler';
import { MarkNotificationAsReadEventHandler } from './application/cqrs/handler/event/mark-notification-as-read.event-handler';
import { RemoveNotificationEventHandler } from './application/cqrs/handler/event/remove-notification.event-handler';
import { SoftRemoveNotificationEventHandler } from './application/cqrs/handler/event/soft-remove-notification.event-handler';
import { RestoreNotificationEventHandler } from './application/cqrs/handler/event/restore-notification.event-handler';
import { HttpModule } from '@nestjs/axios';
import { CreateNotificationCommandHandler } from './application/cqrs/handler/command/create-notification.command-handler';
import { CreateNotificationEventHandler } from './application/cqrs/handler/event/create-notification.event-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProfileEntity, GroupEntity, GroupMembershipEntity, NotificationEntity]),
    CqrsModule,
    ApiLogModule,
    HttpModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    CreateNotificationAdminCommandHandler,
    MarkNotificationAsReadCommandHandler,
    RemoveNotificationCommandHandler,
    RestoreNotificationEventHandler,
    SoftRemoveNotificationCommandHandler,
    CreateNotificationCommandHandler,
    // Query handlers
    GetAllNotificationQueryHandler,
    GetAllNotificationWithUserIdQueryHandler,
    GetAllUnreadNotificationWithUserIdQueryHandler,
    GetNotificationByIdQueryHandler,
    // Event handlers
    CreateNotificationAdminEventHandler,
    MarkNotificationAsReadEventHandler,
    RemoveNotificationEventHandler,
    SoftRemoveNotificationEventHandler,
    RestoreNotificationEventHandler,
    CreateNotificationEventHandler,
  ],
})
export class NotificationModule {}
