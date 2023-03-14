import { Module } from '@nestjs/common';
import { ApiLogService } from './api-log.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ErrorCustomEventHandler } from '../../util/exception/error-handler/error-custom.event-handler';

@Module({
  imports: [ClientsModule.register([{ name: 'API_LOG', transport: Transport.TCP, options: { port: 3001 } }])],
  controllers: [],
  providers: [ApiLogService, ErrorCustomEventHandler],
})
export class ApiLogModule {}
