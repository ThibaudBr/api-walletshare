import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/passport-local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../user/domain/entities/user.entity';
import { RegisterHandler } from './cqrs/handler/command/register.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GetUserLoginHandler } from '../user/cqrs/handler/query/get-user-login.handler';
import { RegisterEventHandler } from './cqrs/event-handler/register.event-handler';
import { ErrorCustomEventHandler } from '../../util/exception/error-handler/error-custom.event-handler';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiLogService } from '../api-log/api-log.service';
import * as process from 'process';
import { CreateLogCommandHandler } from "../api-log/cqrs/handler/command/create-log.command-handler";

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
      { name: 'API_LOG', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_LOG) || 3101 } },
      { name: 'API_MAIL', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_MAIL) || 3102 } },
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
    GetUserLoginHandler,
    RegisterEventHandler,
    ErrorCustomEventHandler,
    CreateLogCommandHandler,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
