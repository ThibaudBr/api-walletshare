import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { SendMailCommandHandler } from './application/cqrs/handler/command/send-mail.command-handler';
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
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HttpModule, CqrsModule, ApiLogModule, UserModule],
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
