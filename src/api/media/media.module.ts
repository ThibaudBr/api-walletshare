import { CacheModuleOptions, Module } from '@nestjs/common';
import { MediaController } from './web/media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { MediaEntity } from './domain/entities/media.entity';
import { MediaService } from './application/media.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { GroupEntity } from '../groupe/domain/entities/group.entity';
import { ProfileEntity } from '../profile/domain/entities/profile.entity';
import { CardEntity } from '../card/domain/entities/card.entity';
import { CompanyEntity } from '../company/domain/entities/company.entity';
import { AddAvatarProfileMediaCommandHandler } from './application/cqrs/handler/command/add-avatar-profile-media.command-handler';
import { AddAvatarProfileMediaEventHandler } from './application/cqrs/handler/event/add-avatar-profile-media.event-handler';
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
import { GetTemporaryMediaUrlQueryHandler } from './application/cqrs/handler/query/get-temporary-media-url.query-handler';
import { IsRoleInCompanyQuery } from '../company/application/cqrs/query/is-role-in-company.query';
import { IsUserIdHaveRoleInGroupQuery } from '../groupe/application/cqrs/query/is-user-id-have-role-in-group.query';
import { AddAvatarCompanyMediaCommandHandler } from './application/cqrs/handler/command/add-avatar-company-media.command-handler';
import { AddAvatarGroupMediaCommandHandler } from './application/cqrs/handler/command/add-avatar-group-media.command-handler';
import { AddBannerCompanyMediaCommandHandler } from './application/cqrs/handler/command/add-banner-company-media.command-handler';
import { AddBannerGroupMediaCommandHandler } from './application/cqrs/handler/command/add-banner-group-media.command-handler';
import { AddBannerProfileMediaCommandHandler } from './application/cqrs/handler/command/add-banner-profile-media.command-handler';
import { AddCardMediaCommandHandler } from './application/cqrs/handler/command/add-card-media.command-handler';
import { AddAvatarCompanyMediaEventHandler } from './application/cqrs/handler/event/add-avatar-company-media.event-handler';
import { AddAvatarGroupMediaEventHandler } from './application/cqrs/handler/event/add-avatar-group-media.event-handler';
import { AddCardMediaEventHandler } from './application/cqrs/handler/event/add-card-media.event-handler';
import { AddBannerProfileMediaEventHandler } from './application/cqrs/handler/event/add-banner-profile-media.event-handler';
import { AddBannerCompanyMediaEventHandler } from './application/cqrs/handler/event/add-banner-company-media.event-handler';
import { AddBannerGroupMediaEventHandler } from './application/cqrs/handler/event/add-banner-group-media.event-handler';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<CacheModuleOptions> => ({
        max: configService.get('CACHE_MEDIA_NUMBER_POOL_MAX') || 1000,
        ttl: configService.get('CACHE_MEDIA_MAX_DURATION') || 60 * 15,
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, MediaEntity, GroupEntity, ProfileEntity, CardEntity, CompanyEntity]),
    CqrsModule,
    ApiLogModule,
    HttpModule,
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    AddAvatarCompanyMediaCommandHandler,
    AddAvatarGroupMediaCommandHandler,
    AddAvatarProfileMediaCommandHandler,
    AddBannerCompanyMediaCommandHandler,
    AddBannerGroupMediaCommandHandler,
    AddBannerProfileMediaCommandHandler,
    AddCardMediaCommandHandler,
    RemoveMediaCommandHandler,
    RestoreMediaCommandHandler,
    SoftRemoveMediaCommandHandler,
    UploadMediaCommandHandler,
    // Query handlers
    GetAllMediaWithDeletedQueryHandler,
    GetMediaWithIdQueryHandler,
    IsUserIdOwnerOfMediaQueryHandler,
    GetTemporaryMediaUrlQueryHandler,
    // Event handlers
    AddAvatarCompanyMediaEventHandler,
    AddAvatarGroupMediaEventHandler,
    AddAvatarProfileMediaEventHandler,
    AddBannerCompanyMediaEventHandler,
    AddBannerGroupMediaEventHandler,
    AddBannerProfileMediaEventHandler,
    AddCardMediaEventHandler,
    RemoveMediaEventHandler,
    RestoreMediaEventHandler,
    SoftRemoveMediaEventHandler,
    UploadMediaEventHandler,
    // import from other module
    IsProfileOwnerWithUserIsQuery,
    IsRoleInCompanyQuery,
    IsUserIdHaveRoleInGroupQuery,
  ],
})
export class MediaModule {}
