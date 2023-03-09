import { Module } from '@nestjs/common';
import { ApiLogService } from './api-log.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP },
      { name: 'API_MAIL', transport: Transport.TCP },
    ]),
  ],
  controllers: [],
  providers: [ApiLogService],
})
export class ApiLogModule {}
