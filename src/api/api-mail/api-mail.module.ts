import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { SendMailCommandHandler } from './cqrs/handler/command/send-mail.command';
import { SendMailEventHandler } from './cqrs/handler/event/send-mail.event-handler';
import { ApiLogService } from '../api-log/api-log.service';
import { ErrorCustomEventHandler } from '../../util/exception/error-handler/error-custom.event-handler';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_LOG) || 3001 } },
      { name: 'API_MAIL', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_MAIL) || 3101 } },
    ]),
    CqrsModule,
    ApiLogModule,
  ],
  controllers: [],
  providers: [ApiLogService, ErrorCustomEventHandler, SendMailCommandHandler, SendMailEventHandler],
})
export class ApiMailModule {}
