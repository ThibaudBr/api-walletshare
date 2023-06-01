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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiLogService } from '../api-log/application/api-log.service';
import * as process from 'process';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { CreateStripeCustomerCommandHandler } from '../payment/stripe/application/cqrs/handler/command/create-stripe-customer.command-handler';
import { CreateStripeCustomerEventHandler } from '../payment/stripe/application/cqrs/handler/event/create-stripe-customer.event-handler';

config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
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
        name: 'API_LANDING_PAGE',
        transport: Transport.TCP,
        options: { port: Number(process.env.PORT_API_WAITING_LIST) || 3103 },
      },
    ]),
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
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
    // Event Handlers
    CreateStripeCustomerEventHandler,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
