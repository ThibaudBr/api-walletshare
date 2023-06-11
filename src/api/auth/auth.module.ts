import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './web/strategy/passport-local.strategy';
import { AuthController } from './web/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../user/domain/entities/user.entity';
import { RegisterHandler } from './application/cqrs/handler/command/register.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtRefreshTokenStrategy } from './web/strategy/jwt-refresh-token.strategy';
import { UserService } from '../user/application/user.service';
import { JwtStrategy } from './web/strategy/jwt.strategy';
import { GetUserLoginQueryHandler } from '../user/application/cqrs/handler/query/get-user-login.query-handler';
import { RegisterEventHandler } from './application/cqrs/event-handler/register.event-handler';
import { ErrorCustomEventHandler } from '../../util/exception/error-handler/error-custom.event-handler';
import { ApiLogModule } from '../api-log/api-log.module';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { CreateStripeCustomerCommandHandler } from '../payment/stripe/application/cqrs/handler/command/create-stripe-customer.command-handler';
import { CreateStripeCustomerEventHandler } from '../payment/stripe/application/cqrs/handler/event/create-stripe-customer.event-handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ReferralCodeEntity } from '../user/domain/entities/referral-code.entity';
import { SetReferralCodeCommandHandler } from '../user/application/cqrs/handler/command/set-referral-code.command-handler';
import { SetReferralCodeEventHandler } from '../user/application/cqrs/handler/event/set-referral-code.event-handler';

config();

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
    HttpModule,
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, ReferralCodeEntity]),
    CqrsModule,
    ApiLogModule,
  ],
  providers: [
    AuthService,
    UserService,
    ApiLogService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    RegisterHandler,
    GetUserLoginQueryHandler,
    RegisterEventHandler,
    ErrorCustomEventHandler,
    CreateLogCommandHandler,
    // Command Handlers
    CreateStripeCustomerCommandHandler,
    SetReferralCodeCommandHandler,
    // Event Handlers
    CreateStripeCustomerEventHandler,
    SetReferralCodeEventHandler,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
