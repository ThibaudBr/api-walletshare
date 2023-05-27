import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { SendMailCommandHandler } from './application/cqrs/handler/command/send-mail.command';
import { SendMailEventHandler } from './application/cqrs/handler/event/send-mail.event-handler';
import { ApiLogService } from '../api-log/application/api-log.service';
import { ErrorCustomEventHandler } from '../../util/exception/error-handler/error-custom.event-handler';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { ApiMailController } from './web/api-mail.controller';
import { ApiMailService } from './application/api-mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/application/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ClientsModule.register([
      {
        name: 'API_LOG',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST_API_LOG || 'localhost',
          port: Number(process.env.PORT_API_LOG) || 3101,
        },
      },
      {
        name: 'API_MAIL',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST_API_MAIL || 'localhost',
          port: Number(process.env.PORT_API_MAIL) || 3102,
        },
      },
    ]),
    CqrsModule,
    ApiLogModule,
    UserModule,
  ],
  controllers: [ApiMailController],
  providers: [
    ApiLogService,
    ApiMailService,
    UserService,
    ErrorCustomEventHandler,
    SendMailCommandHandler,
    SendMailEventHandler,
    CreateLogCommandHandler,
  ],
})
export class ApiMailModule {}
