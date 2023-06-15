import { Module } from '@nestjs/common';
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
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, CqrsModule, ApiLogModule],
  controllers: [ApiLandingPageController],
  providers: [
    ApiLandingPageService,
    ApiLogService,
    ErrorCustomEventHandler,
    CreateLogCommandHandler,
    DeleteMailCommandHandler,
    DeleteMailEventHandler,
    GetAllMailQueryHandler,
  ],
})
export class ApiLandingPageModule {}
