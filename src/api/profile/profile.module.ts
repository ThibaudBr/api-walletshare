import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/domain/entities/user.entity";
import { OccupationEntity } from "../entities-to-create/occupation.entity";
import { ProfileEntity } from "./domain/entities/profile.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { ApiLogModule } from "../api-log/api-log.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { ApiLogService } from "../api-log/api-log.service";
import { CreateLogCommandHandler } from "../api-log/cqrs/handler/command/create-log.command-handler";
import { CreateProfileCommandHandler } from "./cqrs/handler/command/create-profile.command-handler";
import { ShiftProfileOwnerCommandHandler } from "./cqrs/handler/command/shift-profile-owner.command-handler";
import {
  UpdateOccupationsProfileCommandHandler
} from "./cqrs/handler/command/update-occupations-profile.command-handler";
import { GetProfilesByUserIdQueryHandler } from "./cqrs/handler/query/get-profiles-by-user-id.query-handler";
import { GetAllProfileQueryHandler } from "./cqrs/handler/query/get-all-profile.query-handler";
import { GetProfileWithCriteriaQueryHandler } from "./cqrs/handler/query/get-profile-with-criteria.query-handler";
import { DeleteProfileEventHandler } from "./cqrs/handler/event/delete-profile.event-handler";
import { UpdateProfileEventHandler } from "./cqrs/handler/event/update-profile.event-handler";
import { DeleteProfileCommandHandler } from "./cqrs/handler/command/delete-profile.command-handler";
import { GetProfileByIdQueryHandler } from "./cqrs/handler/query/get-profile-by-id.query-handler";
import { UpdateProfileCommandHandler } from "./cqrs/handler/command/update-profile.command-handler";
import { SoftDeleteProfileEventHandler } from "./cqrs/handler/event/soft-delete-profile.event-handler";
import { CreateProfileEventHandler } from "./cqrs/handler/event/create-profile.event-handler";
import { ShiftProfileOwnerEventHandler } from "./cqrs/handler/event/shift-profile-owner.event-handler";
import { SoftDeleteProfileCommandHandler } from "./cqrs/handler/command/soft-delete-profile.command-handler";
import { UpdateOccupationsProfileEventHandler } from "./cqrs/handler/event/update-occupations-profile.event-handler";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProfileEntity, OccupationEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([{ name: 'API_LOG', transport: Transport.TCP, options: { port: 3001 } }]),
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
    // Query handlers
    GetProfileByIdQueryHandler,
    GetProfilesByUserIdQueryHandler,
    GetAllProfileQueryHandler,
    GetProfileWithCriteriaQueryHandler,
    // Event handlers
    CreateProfileEventHandler,
    DeleteProfileEventHandler,
    ShiftProfileOwnerEventHandler,
    SoftDeleteProfileEventHandler,
    UpdateProfileEventHandler,
    UpdateOccupationsProfileEventHandler,
  ],
})
export class ProfileModule {}
