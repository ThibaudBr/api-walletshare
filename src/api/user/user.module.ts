import { Module } from '@nestjs/common';
import { UserEntity } from './domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserCommandHandler } from './cqrs/handler/command/create-user.command-handler';
import { GetUserByEmailQueryHandler } from './cqrs/handler/query/get-user-by-email.query-handler';
import { GetUserByUsernameQueryHandler } from './cqrs/handler/query/get-user-by-username.query-handler';
import { GetUserLoginHandler } from './cqrs/handler/query/get-user-login.handler';
import { GetUserIfRefreshTokenMatchesHandler } from './cqrs/handler/query/get-user-if-refresh-token-matches.handler';
import { GetUserHandler } from './cqrs/handler/query/get-user.handler';
import { ApiLogModule } from '../api-log/api-log.module';
import { ApiLogService } from '../api-log/api-log.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP },
      { name: 'API_MAIL', transport: Transport.TCP },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ApiLogService,
    // Command handlers
    CreateUserCommandHandler,
    // Query handlers
    GetUserByUsernameQueryHandler,
    GetUserByEmailQueryHandler,
    GetUserLoginHandler,
    GetUserIfRefreshTokenMatchesHandler,
    GetUserHandler,
    // Event handlers
  ],
})
export class UserModule {}
