import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { OccupationEntity } from './domain/entities/occupation.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OccupationController } from './web/occupation.controller';
import { OccupationService } from './application/occupation.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { RestoreOccupationCommandHandler } from './application/cqrs/handler/command/restore-occupation.command-handler';
import { SoftDeleteOccupationCommandHandler } from './application/cqrs/handler/command/soft-delete-occupation.command-handler';
import { GetAllOccupationQueryHandler } from './application/cqrs/handler/query/get-all-occupation.query-handler';
import { GetOccupationByIdQueryHandler } from './application/cqrs/handler/query/get-occupation-by-id.query-handler';
import { GetOccupationWithCriteriaQueryHandler } from './application/cqrs/handler/query/get-occupation-with-criteria.query-handler';
import { CreateOccupationEventHandler } from './application/cqrs/handler/event/create-occupation.event-handler';
import { SoftDeleteOccupationEventHandler } from './application/cqrs/handler/event/soft-delete-occupation.event-handler';
import { CreateOccupationCommandHandler } from './application/cqrs/handler/command/create-occupation.command-handler';
import { UpdateOccupationCommandHandler } from './application/cqrs/handler/command/update-occupation.command-handler';
import { RestoreOccupationEventHandler } from './application/cqrs/handler/event/restore-occupation.event-handler';
import { DeleteOccupationCommandHandler } from './application/cqrs/handler/command/delete-occupation.command-handler';
import { UpdateOccupationEventHandler } from './application/cqrs/handler/event/update-occupation.event-handler';
import { DeleteOccupationEventHandler } from './application/cqrs/handler/event/delete-occupation.event-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OccupationEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_LOG) || 3101 } },
    ]),
  ],
  controllers: [OccupationController],
  providers: [
    OccupationService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    CreateOccupationCommandHandler,
    DeleteOccupationCommandHandler,
    RestoreOccupationCommandHandler,
    SoftDeleteOccupationCommandHandler,
    UpdateOccupationCommandHandler,
    // Query handlers
    GetAllOccupationQueryHandler,
    GetOccupationByIdQueryHandler,
    GetOccupationWithCriteriaQueryHandler,
    // Event handlers
    CreateOccupationEventHandler,
    DeleteOccupationEventHandler,
    SoftDeleteOccupationEventHandler,
    UpdateOccupationEventHandler,
    RestoreOccupationEventHandler,
  ],
})
export class OccupationModule {}
