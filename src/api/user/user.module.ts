import { Module } from '@nestjs/common';
import { UserEntity } from './domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './web/user.controller';
import { UserService } from './application/user.service';
import { CreateUserCommandHandler } from './application/cqrs/handler/command/create-user.command-handler';
import { GetUserByEmailQueryHandler } from './application/cqrs/handler/query/get-user-by-email.query-handler';
import { GetUserByUsernameQueryHandler } from './application/cqrs/handler/query/get-user-by-username.query-handler';
import { GetUserLoginQueryHandler } from './application/cqrs/handler/query/get-user-login.query-handler';
import { GetUserIfRefreshTokenMatchesQueryHandler } from './application/cqrs/handler/query/get-user-if-refresh-token-matches.query-handler';
import { GetUserQueryHandler } from './application/cqrs/handler/query/get-user.query-handler';
import { ApiLogModule } from '../api-log/api-log.module';
import { ApiLogService } from '../api-log/application/api-log.service';
import { SetCurrentRefreshTokenCommandHandler } from './application/cqrs/handler/command/set-current-refresh-token.command-handler';
import { UpdateUserCommandHandler } from './application/cqrs/handler/command/update-user.command-handler';
import { RemoveRefreshTokenCommandHandler } from './application/cqrs/handler/command/remove-refresh-token.command-handler';
import { CreateUserEventHandler } from './application/cqrs/handler/event/create-user.event-handler';
import { DeleteUserEventHandler } from './application/cqrs/handler/event/delete-user.event-handler';
import { RemoveRefreshTokenEventHandler } from './application/cqrs/handler/event/remove-refresh-token.event-handler';
import { SetCurrentRefreshTokenEventHandler } from './application/cqrs/handler/event/set-current-refresh-token.event-handler';
import { LoginOfUserEventHandler } from './application/cqrs/handler/event/login-of-user.event-handler';
import { UpdateUserEventHandler } from './application/cqrs/handler/event/update-user.event-handler';
import { SoftDeleteUserCommandHandler } from './application/cqrs/handler/command/soft-delete-user.command-handler';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { GetUserWithCriteriaQueryHandler } from './application/cqrs/handler/query/get-user-with-criteria.query-handler';
import { UpdateUserCredentialCommandHandler } from './application/cqrs/handler/command/update-user-credential.command-handler';
import { UpdateUserRoleCommandHandler } from './application/cqrs/handler/command/update-user-role.command-handler';
import { RestoreUserCommandHandler } from './application/cqrs/handler/command/restore-user.command-handler';
import { DeleteUserCommandHandler } from './application/cqrs/handler/command/delete-user.command-handler';
import { UserLoginEntity } from './domain/entities/user-login.entity';
import { CreateSaveLoginCommandHandler } from './application/cqrs/handler/command/create-save-login.command-handler';
import { GetUserLoginByIdQueryHandler } from './application/cqrs/handler/query/get-user-login-by-id.query-handler';
import { CreateSaveLoginUserEventHandler } from './application/cqrs/handler/event/create-save-login-user.event-handler';
import { CreateStripeCustomerCommandHandler } from '../payment/stripe/application/cqrs/handler/command/create-stripe-customer.command-handler';
import { CreateStripeCustomerEventHandler } from '../payment/stripe/application/cqrs/handler/event/create-stripe-customer.event-handler';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SetReferralCodeCommandHandler } from './application/cqrs/handler/command/set-referral-code.command-handler';
import { SetReferralCodeEventHandler } from './application/cqrs/handler/event/set-referral-code.event-handler';
import { ReferralCodeEntity } from './domain/entities/referral-code.entity';
import { GetUserEntityQueryHandler } from './application/cqrs/handler/query/get-user-entity.query-handler';
import { ApiMailModule } from '../api-mail/api-mail.module';
import { ApiMailService } from '../api-mail/application/api-mail.service';
import { ApiLandingPageModule } from '../api-landing-page/api-landing-page.module';
import { ApiLandingPageService } from '../api-landing-page/application/api-landing-page.service';
import { UpdateFcmTokenCommandHandler } from './application/cqrs/handler/command/update-fcm-token.command-handler';
import { UpdateFcmTokenEventHandler } from './application/cqrs/handler/event/update-fcm-token.event-handler';
import { CreateConnectyCubeUserCommandHandler } from './application/cqrs/handler/command/create-connecty-cube-user.command-handler';
import { CreateConnectyCubeUserEventHandler } from './application/cqrs/handler/event/create-connecty-cube-user.event-handler';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, UserLoginEntity, ReferralCodeEntity]),
    CqrsModule,
    ApiLogModule,
    HttpModule,
    ApiMailModule,
    ApiLandingPageModule,
  ],
  controllers: [UserController],
  providers: [
    ApiLandingPageService,
    ApiMailService,
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
    DeleteUserCommandHandler,
    CreateSaveLoginCommandHandler,
    CreateStripeCustomerCommandHandler,
    SetReferralCodeCommandHandler,
    UpdateFcmTokenCommandHandler,
    CreateConnectyCubeUserCommandHandler,
    // Query handlers
    GetUserByUsernameQueryHandler,
    GetUserByEmailQueryHandler,
    GetUserLoginQueryHandler,
    GetUserIfRefreshTokenMatchesQueryHandler,
    GetUserQueryHandler,
    GetUserWithCriteriaQueryHandler,
    GetUserLoginByIdQueryHandler,
    // Event handlers
    CreateUserEventHandler,
    DeleteUserEventHandler,
    RemoveRefreshTokenEventHandler,
    SetCurrentRefreshTokenEventHandler,
    LoginOfUserEventHandler,
    UpdateUserEventHandler,
    CreateSaveLoginUserEventHandler,
    CreateStripeCustomerEventHandler,
    SetReferralCodeEventHandler,
    GetUserEntityQueryHandler,
    UpdateFcmTokenEventHandler,
    CreateConnectyCubeUserEventHandler,
  ],
})
export class UserModule {}
