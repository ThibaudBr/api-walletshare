import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GroupEntity } from './domain/entities/group.entity';
import { GroupMembershipEntity } from './domain/entities/group-membership.entity';
import { GroupController } from './web/group.controller';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { DeleteGroupMembershipCommandHandler } from './application/cqrs/handler/command/delete-group-membership.command-handler';
import { CreateGroupCommandHandler } from './application/cqrs/handler/command/create-group.command-handler';
import { DeleteGroupCommandHandler } from './application/cqrs/handler/command/delete-group.command-handler';
import { GiveAdminRightGroupCommandHandler } from './application/cqrs/handler/command/give-admin-right-group.command-handler';
import { RemoveAdminRightGroupCommandHandler } from './application/cqrs/handler/command/remove-admin-right-group.command-handler';
import { RemoveCardFromGroupCommandHandler } from './application/cqrs/handler/command/remove-card-from-group.command-handler';
import { RestoreGroupCommandHandler } from './application/cqrs/handler/command/restore-group.command-handler';
import { SoftDeleteGroupCommandHandler } from './application/cqrs/handler/command/soft-delete-group.command-handler';
import { UpdateGroupCommandHandler } from './application/cqrs/handler/command/update-group.command-handler';
import { GetAllGroupQueryHandler } from './application/cqrs/handler/query/get-all-group.query-handler';
import { GetGroupByIdQueryHandler } from './application/cqrs/handler/query/get-group-by-id.query-handler';
import { GetGroupMemberQueryHandler } from './application/cqrs/handler/query/get-group-member.query-handler';
import { GetGroupMembershipWithCardIdQueryHandler } from './application/cqrs/handler/query/get-group-membership-with-card-id.query-handler';
import { GetGroupMembershipWithCriteriaQueryHandler } from './application/cqrs/handler/query/get-group-membership-with-criteria.query-handler';
import { GetGroupWhereCardIsAdminQueryHandler } from './application/cqrs/handler/query/get-group-where-card-is-admin.query-handler';
import { GetGroupWhereUserIdIsMemberQueryHandler } from './application/cqrs/handler/query/get-group-where-user-id-is-member.query-handler';
import { GetGroupWithCriteriaQueryHandler } from './application/cqrs/handler/query/get-group-with-criteria.query-handler';
import { IsUserIdHaveRoleInGroupQueryHandler } from './application/cqrs/handler/query/is-user-id-have-role-in-group.query-handler';
import { CreateGroupEventHandler } from './application/cqrs/handler/event/create-group.event-handler';
import { DeleteGroupEventHandler } from './application/cqrs/handler/event/delete-group.event-handler';
import { DeleteGroupMembershipEventHandler } from './application/cqrs/handler/event/delete-group-membership.event-handler';
import { GiveAdminRightGroupEventHandler } from './application/cqrs/handler/event/give-admin-right-group.event-handler';
import { RemoveAdminRightGroupEventHandler } from './application/cqrs/handler/event/remove-admin-right-group.event-handler';
import { RemoveCardFromGroupEventHandler } from './application/cqrs/handler/event/remove-card-from-group.event-handler';
import { RestoreGroupEventHandler } from './application/cqrs/handler/event/restore-group.event-handler';
import { SoftDeleteGroupEventHandler } from './application/cqrs/handler/event/soft-delete-group.event-handler';
import { UpdateGroupEventHandler } from './application/cqrs/handler/event/update-group.event-handler';
import { GroupService } from './application/group.service';
import { CardEntity } from '../card/domain/entities/card.entity';
import { AddCardToGroupCommandHandler } from './application/cqrs/handler/command/add-card-to-group.command-handler';
import { AddCardToGroupEventHandler } from './application/cqrs/handler/event/add-card-to-group.event-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, GroupEntity, GroupMembershipEntity, CardEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([
      {
        name: 'API_LOG',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST_API_LOG || 'localhost',
          port: Number(process.env.PORT_API_LOG) || 3101,
        },
      },
    ]),
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    AddCardToGroupCommandHandler,
    CreateGroupCommandHandler,
    DeleteGroupCommandHandler,
    DeleteGroupMembershipCommandHandler,
    GiveAdminRightGroupCommandHandler,
    RemoveAdminRightGroupCommandHandler,
    RemoveCardFromGroupCommandHandler,
    RestoreGroupCommandHandler,
    SoftDeleteGroupCommandHandler,
    UpdateGroupCommandHandler,
    // Query handlers
    GetAllGroupQueryHandler,
    GetGroupByIdQueryHandler,
    GetGroupMemberQueryHandler,
    GetGroupMembershipWithCardIdQueryHandler,
    GetGroupMembershipWithCriteriaQueryHandler,
    GetGroupWhereCardIsAdminQueryHandler,
    GetGroupWhereUserIdIsMemberQueryHandler,
    GetGroupWithCriteriaQueryHandler,
    IsUserIdHaveRoleInGroupQueryHandler,
    // Event handlers
    AddCardToGroupEventHandler,
    CreateGroupEventHandler,
    DeleteGroupEventHandler,
    DeleteGroupMembershipEventHandler,
    GiveAdminRightGroupEventHandler,
    RemoveAdminRightGroupEventHandler,
    RemoveCardFromGroupEventHandler,
    RestoreGroupEventHandler,
    SoftDeleteGroupEventHandler,
    UpdateGroupEventHandler,
  ],
})
export class GroupModule {}
