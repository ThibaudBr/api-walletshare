import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { OccupationEntity } from '../occupation/domain/entities/occupation.entity';
import { ProfileEntity } from './domain/entities/profile.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ProfileController } from './web/profile.controller';
import { ProfileService } from './application/profile.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { CreateProfileCommandHandler } from './application/cqrs/handler/command/create-profile.command-handler';
import { ShiftProfileOwnerCommandHandler } from './application/cqrs/handler/command/shift-profile-owner.command-handler';
import { UpdateOccupationsProfileCommandHandler } from './application/cqrs/handler/command/update-occupations-profile.command-handler';
import { GetProfilesByUserIdQueryHandler } from './application/cqrs/handler/query/get-profiles-by-user-id.query-handler';
import { GetAllProfileQueryHandler } from './application/cqrs/handler/query/get-all-profile.query-handler';
import { GetProfileWithCriteriaQueryHandler } from './application/cqrs/handler/query/get-profile-with-criteria.query-handler';
import { DeleteProfileEventHandler } from './application/cqrs/handler/event/delete-profile.event-handler';
import { UpdateProfileEventHandler } from './application/cqrs/handler/event/update-profile.event-handler';
import { DeleteProfileCommandHandler } from './application/cqrs/handler/command/delete-profile.command-handler';
import { GetProfileByIdQueryHandler } from './application/cqrs/handler/query/get-profile-by-id.query-handler';
import { UpdateProfileCommandHandler } from './application/cqrs/handler/command/update-profile.command-handler';
import { SoftDeleteProfileEventHandler } from './application/cqrs/handler/event/soft-delete-profile.event-handler';
import { CreateProfileEventHandler } from './application/cqrs/handler/event/create-profile.event-handler';
import { ShiftProfileOwnerEventHandler } from './application/cqrs/handler/event/shift-profile-owner.event-handler';
import { SoftDeleteProfileCommandHandler } from './application/cqrs/handler/command/soft-delete-profile.command-handler';
import { UpdateOccupationsProfileEventHandler } from './application/cqrs/handler/event/update-occupations-profile.event-handler';
import { RestoreProfileCommandHandler } from './application/cqrs/handler/command/restore-profile.command-handler';
import { RestoreProfileEventHandler } from './application/cqrs/handler/event/restore-profile.event-handler';
import { IsProfileWithGivenRoleAlreadyExistQueryHandler } from './application/cqrs/handler/query/is-profile-with-given-role-already-exist.query-handler';
import { HttpModule } from '@nestjs/axios';
import { UpdateRoleProfileCommandHandler } from './application/cqrs/handler/command/update-role-profile.command-handler';
import { UpdateRoleProfileEventHandler } from './application/cqrs/handler/event/update-role-profile.event-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProfileEntity, OccupationEntity]),
    CqrsModule,
    ApiLogModule,
    HttpModule,
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    CreateProfileCommandHandler,
    DeleteProfileCommandHandler,
    ShiftProfileOwnerCommandHandler,
    SoftDeleteProfileCommandHandler,
    UpdateProfileCommandHandler,
    UpdateOccupationsProfileCommandHandler,
    RestoreProfileCommandHandler,
    UpdateRoleProfileCommandHandler,
    // Query handlers
    GetProfileByIdQueryHandler,
    GetProfilesByUserIdQueryHandler,
    GetAllProfileQueryHandler,
    GetProfileWithCriteriaQueryHandler,
    IsProfileWithGivenRoleAlreadyExistQueryHandler,
    // Event handlers
    CreateProfileEventHandler,
    DeleteProfileEventHandler,
    ShiftProfileOwnerEventHandler,
    SoftDeleteProfileEventHandler,
    UpdateProfileEventHandler,
    UpdateOccupationsProfileEventHandler,
    RestoreProfileEventHandler,
    UpdateRoleProfileEventHandler,
  ],
})
export class ProfileModule {}
