import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SocialNetworkEntity } from './domain/entities/social-network.entity';
import { SocialNetworkController } from './web/social-network.controller';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { GetAllSocialNetworkQueryHandler } from './application/cqrs/handler/query/get-all-social-network.query-handler';
import { GetSocialNetworkWithCriteriaQueryHandler } from './application/cqrs/handler/query/get-social-network-with-criteria.query-handler';
import { RestoreSocialNetworkEventHandler } from './application/cqrs/handler/event/restore-social-network.event-handler';
import { SoftDeleteSocialNetworkEventHandler } from './application/cqrs/handler/event/soft-delete-social-network.event-handler';
import { DeleteSocialNetworkCommandHandler } from './application/cqrs/handler/command/delete-social-network.command-handler';
import { CreateSocialNetworkEventHandler } from './application/cqrs/handler/event/create-social-network.event-handler';
import { CreateSocialNetworkCommandHandler } from './application/cqrs/handler/command/create-social-network.command-handler';
import { GetSocialNetworkByIdQueryHandler } from './application/cqrs/handler/query/get-social-network-by-id.query-handler';
import { DeleteSocialNetworkEventHandler } from './application/cqrs/handler/event/delete-social-network.event-handler';
import { RestoreSocialNetworkCommandHandler } from './application/cqrs/handler/command/restore-social-network.command-handler';
import { SocialNetworkService } from './application/social-network.service';
import { UpdateSocialNetworkCommandHandler } from './application/cqrs/handler/command/update-social-network.command-handler';
import { UpdateSocialNetworkEventHandler } from './application/cqrs/handler/event/update-social-network.event-handler';
import { SoftDeleteSocialNetworkCommandHandler } from './application/cqrs/handler/command/soft-delete-social-network.command-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, SocialNetworkEntity]),
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
  controllers: [SocialNetworkController],
  providers: [
    SocialNetworkService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    CreateSocialNetworkCommandHandler,
    DeleteSocialNetworkCommandHandler,
    RestoreSocialNetworkCommandHandler,
    SoftDeleteSocialNetworkCommandHandler,
    UpdateSocialNetworkCommandHandler,
    // Query handlers
    GetAllSocialNetworkQueryHandler,
    GetSocialNetworkByIdQueryHandler,
    GetSocialNetworkWithCriteriaQueryHandler,
    // Event handlers
    CreateSocialNetworkEventHandler,
    DeleteSocialNetworkEventHandler,
    SoftDeleteSocialNetworkEventHandler,
    UpdateSocialNetworkEventHandler,
    RestoreSocialNetworkEventHandler,
  ],
})
export class SocialNetworkModule {}
