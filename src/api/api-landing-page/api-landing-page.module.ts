import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ApiLandingPageController } from './web/api-landing-page.controller';
import { ErrorCustomEventHandler } from '../../util/exception/error-handler/error-custom.event-handler';
import { DeleteMailCommandHandler } from './application/cqrs/handler/command/delete-mail.command-handler';
import { DeleteMailEventHandler } from './application/cqrs/handler/event/delete-mail.event-handler';
import { GetAllMailQueryHandler } from './application/cqrs/handler/query/get-all-mail.query-handler';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { ApiLandingPageService } from './application/api-landing-page.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/application/user.service';

@Module({
  imports: [
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
      {
        name: 'API_WAITING_LIST',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST_API_WAITING_LIST || 'localhost',
          port: Number(process.env.PORT_API_WAITING_LIST) || 3103,
        },
      },
    ]),
    CqrsModule,
    ApiLogModule,
    UserModule,
  ],
  controllers: [ApiLandingPageController],
  providers: [
    ApiLandingPageService,
    ApiLogService,
    UserService,
    ErrorCustomEventHandler,
    CreateLogCommandHandler,
    DeleteMailCommandHandler,
    DeleteMailEventHandler,
    GetAllMailQueryHandler,
  ],
})
export class ApiLandingPageModule {}
