import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { OccupationEntity } from './domain/entities/occupation.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OccupationController } from './occupation.controller';
import { OccupationService } from './occupation.service';
import { ApiLogService } from '../api-log/api-log.service';
import { CreateLogCommandHandler } from '../api-log/cqrs/handler/command/create-log.command-handler';
import { RestoreOccupationCommandHandler } from './cqrs/handler/command/restore-occupation.command-handler';
import { SoftDeleteOccupationCommandHandler } from './cqrs/handler/command/soft-delete-occupation.command-handler';
import { GetAllOccupationQueryHandler } from './cqrs/handler/query/get-all-occupation.query-handler';
import { GetOccupationByIdQueryHandler } from './cqrs/handler/query/get-occupation-by-id.query-handler';
import { GetOccupationWithCriteriaQueryHandler } from './cqrs/handler/query/get-occupation-with-criteria.query-handler';
import { CreateOccupationEventHandler } from './cqrs/handler/event/create-occupation.event-handler';
import { SoftDeleteOccupationEventHandler } from './cqrs/handler/event/soft-delete-occupation.event-handler';
import { CreateOccupationCommandHandler } from './cqrs/handler/command/create-occupation.command-handler';
import { UpdateOccupationCommandHandler } from './cqrs/handler/command/update-occupation.command-handler';
import { RestoreOccupationEventHandler } from './cqrs/handler/event/restore-occupation.event-handler';
import { DeleteOccupationCommandHandler } from './cqrs/handler/command/delete-occupation.command-handler';
import { UpdateOccupationEventHandler } from './cqrs/handler/event/update-occupation.event-handler';
import { DeleteOccupationEventHandler } from './cqrs/handler/event/delete-occupation.event-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OccupationEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([{ name: 'API_LOG', transport: Transport.TCP, options: { port: 3001 } }]),
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
