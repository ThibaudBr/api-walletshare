import { Module } from '@nestjs/common';
import { ApiLogService } from './api-log.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ErrorCustomEventHandler } from '../../util/exception/error-handler/error-custom.event-handler';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateLogCommandHandler } from './cqrs/handler/command/create-log.command-handler';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_LOG) || 3101 } },
    ]),
    CqrsModule,
    ApiLogModule,
  ],
  controllers: [],
  providers: [ApiLogService, ErrorCustomEventHandler, CreateLogCommandHandler],
})
export class ApiLogModule {}
