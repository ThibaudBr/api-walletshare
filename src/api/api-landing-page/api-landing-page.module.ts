import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ApiLandingPageController } from './api-landing-page.controller';
import { ErrorCustomEventHandler } from '../../util/exception/error-handler/error-custom.event-handler';
import { DeleteMailCommandHandler } from './cqrs/handler/command/delete-mail.command-handler';
import { DeleteMailEventHandler } from './cqrs/handler/event/delete-mail.event-handler';
import { GetAllMailQueryHandler } from './cqrs/handler/query/get-all-mail.query-handler';
import { CreateLogCommandHandler } from '../api-log/cqrs/handler/command/create-log.command-handler';
import { ApiLandingPageService } from './api-landing-page.service';
import { ApiLogService } from '../api-log/api-log.service';
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";

@Module({
  imports: [
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_LOG) || 3101 } },
      { name: 'API_MAIL', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_MAIL) || 3102 } },
      {
        name: 'API_WAITING_LIST',
        transport: Transport.TCP,
        options: { port: Number(process.env.PORT_API_WAITING_LIST) || 3103 },
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
