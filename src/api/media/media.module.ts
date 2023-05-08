import { Module } from '@nestjs/common';
import { MediaController } from './web/media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MediaEntity } from './domain/entities/media.entity';
import { MediaService } from './application/media.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { GroupEntity } from '../groupe/domain/entities/group.entity';
import { ProfileEntity } from '../profile/domain/entities/profile.entity';
import { CardEntity } from '../card/domain/entities/card.entity';
import { CompanyEntity } from '../company/domain/entities/company.entity';
import { AddAvatarProfileCommandHandler } from './application/cqrs/handler/command/add-avatar-profile.command-handler';
import { AddAvatarProfileEventHandler } from './application/cqrs/handler/event/add-avatar-profile.event-handler';
import { RemoveMediaEventHandler } from './application/cqrs/handler/event/remove-media-event.handler';
import { RestoreMediaEventHandler } from './application/cqrs/handler/event/restore-media.event-handler';
import { RemoveMediaCommandHandler } from './application/cqrs/handler/command/remove-media-command.handler';
import { RestoreMediaCommandHandler } from './application/cqrs/handler/command/restore-media.command-handler';
import { SoftRemoveMediaCommandHandler } from './application/cqrs/handler/command/soft-remove-media.command-handler';
import { UploadMediaCommandHandler } from './application/cqrs/handler/command/upload-media.command-handler';
import { SoftRemoveMediaEventHandler } from './application/cqrs/handler/event/soft-remove-media.event-handler';
import { UploadMediaEventHandler } from './application/cqrs/handler/event/upload-media.event-handler';
import { GetAllMediaWithDeletedQueryHandler } from './application/cqrs/handler/query/get-all-media-with-deleted.query-handler';
import { GetMediaWithIdQueryHandler } from './application/cqrs/handler/query/get-media-with-id.query-handler';
import { IsUserIdOwnerOfMediaQueryHandler } from './application/cqrs/handler/query/is-user-id-owner-of-media.query-handler';
import { IsProfileOwnerWithUserIsQuery } from '../card/application/cqrs/query/is-profile-owner-with-user-is.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, MediaEntity, GroupEntity, ProfileEntity, CardEntity, CompanyEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_LOG) || 3101 } },
    ]),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    AddAvatarProfileCommandHandler,
    RemoveMediaCommandHandler,
    RestoreMediaCommandHandler,
    SoftRemoveMediaCommandHandler,
    UploadMediaCommandHandler,
    // Query handlers
    GetAllMediaWithDeletedQueryHandler,
    GetMediaWithIdQueryHandler,
    IsUserIdOwnerOfMediaQueryHandler,
    // Event handlers
    AddAvatarProfileEventHandler,
    RemoveMediaEventHandler,
    RestoreMediaEventHandler,
    SoftRemoveMediaEventHandler,
    UploadMediaEventHandler,
    // import from other module
    IsProfileOwnerWithUserIsQuery,
  ],
})
export class MediaModule {}
