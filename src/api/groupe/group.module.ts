import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GroupEntity } from './domain/entities/group.entity';
import { GroupRequestEntity } from './domain/entities/group-request.entity';
import { GroupMembershipEntity } from './domain/entities/group-membership.entity';
import { GroupController } from './group.controller';
import { ApiLogService } from '../api-log/api-log.service';
import { CreateLogCommandHandler } from '../api-log/cqrs/handler/command/create-log.command-handler';
import { AcceptGroupRequestCommandHandler } from './cqrs/handler/command/accept-group-request.command-handler';
import { CancelGroupRequestCommandHandler } from './cqrs/handler/command/cancel-group-request.command-handler';
import { DeleteGroupMembershipCommandHandler } from './cqrs/handler/command/delete-group-membership.command-handler';
import { CreateGroupCommandHandler } from './cqrs/handler/command/create-group.command-handler';
import { DeleteGroupCommandHandler } from './cqrs/handler/command/delete-group.command-handler';
import { DeleteGroupRequestCommandHandler } from './cqrs/handler/command/delete-group-request.command-handler';
import { GiveAdminRightGroupCommandHandler } from './cqrs/handler/command/give-admin-right-group.command-handler';
import { RemoveAdminRightGroupCommandHandler } from './cqrs/handler/command/remove-admin-right-group.command-handler';
import { RemoveCardFromGroupCommandHandler } from './cqrs/handler/command/remove-card-from-group.command-handler';
import { RestoreGroupCommandHandler } from './cqrs/handler/command/restore-group.command-handler';
import { SendGroupRequestCommandHandler } from './cqrs/handler/command/send-group-request.command-handler';
import { SoftDeleteGroupCommandHandler } from './cqrs/handler/command/soft-delete-group.command-handler';
import { UpdateGroupCommandHandler } from './cqrs/handler/command/update-group.command-handler';
import { GetAllGroupQueryHandler } from './cqrs/handler/query/get-all-group.query-handler';
import { GetGroupByIdQueryHandler } from './cqrs/handler/query/get-group-by-id.query-handler';
import { GetGroupMemberQueryHandler } from './cqrs/handler/query/get-group-member.query-handler';
import { GetGroupMembershipWithCardIdQueryHandler } from './cqrs/handler/query/get-group-membership-with-card-id.query-handler';
import { GetGroupMembershipWithCriteriaQueryHandler } from './cqrs/handler/query/get-group-membership-with-criteria.query-handler';
import { GetGroupRequestWithCardIdAndGroupIdQueryHandler } from './cqrs/handler/query/get-group-request-with-card-id-and-group-id.query-handler';
import { GetGroupRequestWithCriteriaQueryHandler } from './cqrs/handler/query/get-group-request-with-criteria.query-handler';
import { GetGroupWhereCardIsAdminQueryHandler } from './cqrs/handler/query/get-group-where-card-is-admin.query-handler';
import { GetGroupWhereUserIdIsMemberQueryHandler } from './cqrs/handler/query/get-group-where-user-id-is-member.query-handler';
import { GetGroupWithCriteriaQueryHandler } from './cqrs/handler/query/get-group-with-criteria.query-handler';
import { IsUserIdHaveRoleInGroupQueryHandler } from './cqrs/handler/query/is-user-id-have-role-in-group.query-handler';
import { AcceptGroupRequestEventHandler } from './cqrs/handler/event/accept-group-request.event-handler';
import { CancelGroupRequestEventHandler } from './cqrs/handler/event/cancel-group-request.event-handler';
import { CreateGroupEventHandler } from './cqrs/handler/event/create-group.event-handler';
import { DeleteGroupEventHandler } from './cqrs/handler/event/delete-group.event-handler';
import { DeleteGroupMembershipEventHandler } from './cqrs/handler/event/delete-group-membership.event-handler';
import { DeleteGroupRequestEventHandler } from './cqrs/handler/event/delete-group-request.event-handler';
import { GiveAdminRightGroupEventHandler } from './cqrs/handler/event/give-admin-right-group.event-handler';
import { RemoveAdminRightGroupEventHandler } from './cqrs/handler/event/remove-admin-right-group.event-handler';
import { RemoveCardFromGroupEventHandler } from './cqrs/handler/event/remove-card-from-group.event-handler';
import { RestoreGroupEventHandler } from './cqrs/handler/event/restore-group.event-handler';
import { SendGroupRequestEventHandler } from './cqrs/handler/event/send-group-request.event-handler';
import { SoftDeleteGroupEventHandler } from './cqrs/handler/event/soft-delete-group.event-handler';
import { UpdateGroupEventHandler } from './cqrs/handler/event/update-group.event-handler';
import { GroupService } from './group.service';
import { CardEntity } from "../card/domain/entities/card.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, GroupEntity, GroupRequestEntity, GroupMembershipEntity, CardEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([{ name: 'API_LOG', transport: Transport.TCP, options: { port: 3001 } }]),
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    AcceptGroupRequestCommandHandler,
    CancelGroupRequestCommandHandler,
    CreateGroupCommandHandler,
    DeleteGroupCommandHandler,
    DeleteGroupMembershipCommandHandler,
    DeleteGroupRequestCommandHandler,
    GiveAdminRightGroupCommandHandler,
    RemoveAdminRightGroupCommandHandler,
    RemoveCardFromGroupCommandHandler,
    RestoreGroupCommandHandler,
    SendGroupRequestCommandHandler,
    SoftDeleteGroupCommandHandler,
    UpdateGroupCommandHandler,
    // Query handlers
    GetAllGroupQueryHandler,
    GetGroupByIdQueryHandler,
    GetGroupMemberQueryHandler,
    GetGroupMembershipWithCardIdQueryHandler,
    GetGroupMembershipWithCriteriaQueryHandler,
    GetGroupRequestWithCardIdAndGroupIdQueryHandler,
    GetGroupRequestWithCriteriaQueryHandler,
    GetGroupWhereCardIsAdminQueryHandler,
    GetGroupWhereUserIdIsMemberQueryHandler,
    GetGroupWithCriteriaQueryHandler,
    IsUserIdHaveRoleInGroupQueryHandler,
    // Event handlers
    AcceptGroupRequestEventHandler,
    CancelGroupRequestEventHandler,
    CreateGroupEventHandler,
    DeleteGroupEventHandler,
    DeleteGroupMembershipEventHandler,
    DeleteGroupRequestEventHandler,
    GiveAdminRightGroupEventHandler,
    RemoveAdminRightGroupEventHandler,
    RemoveCardFromGroupEventHandler,
    RestoreGroupEventHandler,
    SendGroupRequestEventHandler,
    SoftDeleteGroupEventHandler,
    UpdateGroupEventHandler,
  ],
})
export class GroupModule {}
