import { Module } from '@nestjs/common';
import { ApiLogService } from './application/api-log.service';
import { ErrorCustomEventHandler } from '../../util/exception/error-handler/error-custom.event-handler';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateLogCommandHandler } from './application/cqrs/handler/command/create-log.command-handler';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, CqrsModule],
  controllers: [],
  providers: [ApiLogService, ErrorCustomEventHandler, CreateLogCommandHandler],
})
export class ApiLogModule {}
