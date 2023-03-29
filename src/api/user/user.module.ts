import { Module } from '@nestjs/common';
import { UserEntity } from './domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './web/user.controller';
import { UserService } from './user.service';
import { CreateUserCommandHandler } from './cqrs/handler/command/create-user.command-handler';
import { GetUserByEmailQueryHandler } from './cqrs/handler/query/get-user-by-email.query-handler';
import { GetUserByUsernameQueryHandler } from './cqrs/handler/query/get-user-by-username.query-handler';
import { GetUserLoginQueryHandler } from './cqrs/handler/query/get-user-login.query-handler';
import { GetUserIfRefreshTokenMatchesQueryHandler } from './cqrs/handler/query/get-user-if-refresh-token-matches.query-handler';
import { GetUserQueryHandler } from './cqrs/handler/query/get-user.query-handler';
import { ApiLogModule } from '../api-log/api-log.module';
import { ApiLogService } from '../api-log/api-log.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SetCurrentRefreshTokenCommandHandler } from './cqrs/handler/command/set-current-refresh-token.command-handler';
import { UpdateUserCommandHandler } from './cqrs/handler/command/update-user.command-handler';
import { RemoveRefreshTokenCommandHandler } from './cqrs/handler/command/remove-refresh-token.command-handler';
import { CreateUserEventHandler } from './cqrs/handler/event/create-user.event-handler';
import { DeleteUserEventHandler } from './cqrs/handler/event/delete-user.event-handler';
import { RemoveRefreshTokenEventHandler } from './cqrs/handler/event/remove-refresh-token.event-handler';
import { SetCurrentRefreshTokenEventHandler } from './cqrs/handler/event/set-current-refresh-token.event-handler';
import { LoginOfUserEventHandler } from './cqrs/handler/event/login-of-user.event-handler';
import { UpdateUserEventHandler } from './cqrs/handler/event/update-user.event-handler';
import { SoftDeleteUserCommandHandler } from './cqrs/handler/command/soft-delete-user.command-handler';
import { CreateLogCommandHandler } from '../api-log/cqrs/handler/command/create-log.command-handler';
import { GetUserWithCriteriaQueryHandler } from './cqrs/handler/query/get-user-with-criteria.query-handler';
import { UpdateUserCredentialCommandHandler } from './cqrs/handler/command/update-user-credential.command-handler';
import { UpdateUserRoleCommandHandler } from './cqrs/handler/command/update-user-role.command-handler';
import { RestoreUserCommandHandler } from './cqrs/handler/command/restore-user.command-handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([{ name: 'API_LOG', transport: Transport.TCP, options: { port: 3001 } }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Command handlers
    CreateUserCommandHandler,
    RemoveRefreshTokenCommandHandler,
    SetCurrentRefreshTokenCommandHandler,
    UpdateUserCommandHandler,
    SoftDeleteUserCommandHandler,
    UpdateUserCredentialCommandHandler,
    UpdateUserRoleCommandHandler,
    RestoreUserCommandHandler,
    // Query handlers
    GetUserByUsernameQueryHandler,
    GetUserByEmailQueryHandler,
    GetUserLoginQueryHandler,
    GetUserIfRefreshTokenMatchesQueryHandler,
    GetUserQueryHandler,
    GetUserWithCriteriaQueryHandler,
    // Event handlers
    CreateUserEventHandler,
    DeleteUserEventHandler,
    RemoveRefreshTokenEventHandler,
    SetCurrentRefreshTokenEventHandler,
    LoginOfUserEventHandler,
    UpdateUserEventHandler,
  ],
})
export class UserModule {}
