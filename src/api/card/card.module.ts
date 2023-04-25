import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { SocialNetworkEntity } from '../social-network/domain/entities/social-network.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CardEntity } from './domain/entities/card.entity';
import { ProfileEntity } from '../profile/domain/entities/profile.entity';
import { OccupationEntity } from '../occupation/domain/entities/occupation.entity';
import { CardService } from './card.service';
import { AddConnectedCardCommandHandler } from './cqrs/handler/command/add-connected-card.command-handler';
import { AddSavedCardCommandHandler } from './cqrs/handler/command/add-saved-card.command-handler';
import { CreateCardCommandHandler } from './cqrs/handler/command/create-card.command-handler';
import { DeleteCardCommandHandler } from './cqrs/handler/command/delete-card.command-handler';
import { RemoveConnectedCardCommandHandler } from './cqrs/handler/command/remove-connected-card.command-handler';
import { RestoreCardCommandHandler } from './cqrs/handler/command/restore-card.command-handler';
import { SoftDeleteCardCommandHandler } from './cqrs/handler/command/soft-delete-card.command-handler';
import { GetAllCardWithProfileIdQueryHandler } from './cqrs/handler/query/get-all-card-with-profile-id.query-handler';
import { GetAllCardWithUserIdQueryHandler } from './cqrs/handler/query/get-all-card-with-user-id.query-handler';
import { GetCardWithCriteriaQueryHandler } from './cqrs/handler/query/get-card-with-criteria.query-handler';
import { GetSavedCardWithProfileIdQueryHandler } from './cqrs/handler/query/get-saved-card-with-profile-id.query-handler';
import { GetSavedCardWithUserIdQueryHandler } from './cqrs/handler/query/get-saved-card-with-user-id.query-handler';
import { IsCardOwnerWithUserIdQueryHandler } from './cqrs/handler/query/is-card-owner-with-user-id.query-handler';
import { IsProfileOwnerWithUserIsQueryHandler } from './cqrs/handler/query/is-profile-owner-with-user-id.query-handler';
import { ApiLogService } from '../api-log/api-log.service';
import { CreateLogCommandHandler } from '../api-log/cqrs/handler/command/create-log.command-handler';
import { UpdateCardCommandHandler } from './cqrs/handler/command/update-card.command-handler';
import { GetAllCardQueryHandler } from './cqrs/handler/query/get-all-card.query-handler';
import { GetCardByIdQueryHandler } from './cqrs/handler/query/get-card-by-id.query-handler';
import { AddConnectedCardEventHandler } from './cqrs/handler/event/add-connected-card.event-handler';
import { AddSavedCardEventHandler } from './cqrs/handler/event/add-saved-card.event-handler';
import { AddViewCountCardCommandHandler } from './cqrs/handler/command/add-view-count-card.command-handler';
import { AddViewCountCardEventHandler } from './cqrs/handler/event/add-view-count-card.event-handler';
import { CreateCardEventHandler } from './cqrs/handler/event/create-card.event-handler';
import { DeleteCardEventHandler } from './cqrs/handler/event/delete-card.event-handler';
import { RemoveConnectedCardEventHandler } from './cqrs/handler/event/remove-connected-card.event-handler';
import { RestoreCardEventHandler } from './cqrs/handler/event/restore-card.event-handler';
import { SoftDeleteCardEventHandler } from './cqrs/handler/event/soft-delete-card.event-handler';
import { UpdateCardEventHandler } from './cqrs/handler/event/update-card.event-handler';
import { ConnectedCardEntity } from './domain/entities/connected-card.entity';
import { RemoveSavedCardCommandHandler } from './cqrs/handler/command/remove-saved-card.command-handler';
import { RemoveSavedCardEventHandler } from './cqrs/handler/event/remove-saved-card.event-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SocialNetworkEntity,
      CardEntity,
      ProfileEntity,
      OccupationEntity,
      ConnectedCardEntity,
    ]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([{ name: 'API_LOG', transport: Transport.TCP, options: { port: 3001 } }]),
  ],
  controllers: [CardController],
  providers: [
    CardService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    AddConnectedCardCommandHandler,
    AddSavedCardCommandHandler,
    AddViewCountCardCommandHandler,
    CreateCardCommandHandler,
    DeleteCardCommandHandler,
    RemoveConnectedCardCommandHandler,
    RestoreCardCommandHandler,
    SoftDeleteCardCommandHandler,
    UpdateCardCommandHandler,
    RemoveSavedCardCommandHandler,
    // Query handlers
    GetAllCardQueryHandler,
    GetAllCardWithProfileIdQueryHandler,
    GetAllCardWithUserIdQueryHandler,
    GetCardByIdQueryHandler,
    GetCardWithCriteriaQueryHandler,
    GetSavedCardWithProfileIdQueryHandler,
    GetSavedCardWithUserIdQueryHandler,
    IsCardOwnerWithUserIdQueryHandler,
    IsProfileOwnerWithUserIsQueryHandler,
    // event handlers
    AddConnectedCardEventHandler,
    AddSavedCardEventHandler,
    AddViewCountCardEventHandler,
    CreateCardEventHandler,
    DeleteCardEventHandler,
    RemoveConnectedCardEventHandler,
    RestoreCardEventHandler,
    SoftDeleteCardEventHandler,
    UpdateCardEventHandler,
    RemoveSavedCardEventHandler,
  ],
})
export class CardModule {}
