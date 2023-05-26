import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfiguration } from './util/config/database.configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import HealthCheckModule from './api/health-check/health-check.module';
import { EntitiesToMoveModule } from './api/entities-to-create/entities-to-move.module';
import { UserModule } from './api/user/user.module';
import { ApiLogModule } from './api/api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';
import { ResponseLoggingMiddleware } from './middleware/response-logging.middleware';
import { ErrorLoggingMiddleware } from './middleware/error-logging.middleware';
import { ApiLogService } from './api/api-log/application/api-log.service';
import { AuthModule } from './api/auth/auth.module';
import { ApiMailModule } from './api/api-mail/api-mail.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLandingPageModule } from './api/api-landing-page/api-landing-page.module';
import { ProfileModule } from './api/profile/profile.module';
import { OccupationModule } from './api/occupation/occupation.module';
import { SocialNetworkModule } from './api/social-network/social-network.module';
import { CardModule } from './api/card/card.module';
import { GroupModule } from './api/groupe/group.module';
import * as process from 'process';
import { AddressModule } from './api/address/address.module';
import { CompanyModule } from './api/company/company.module';
import { MediaModule } from './api/media/media.module';
import { SaveUserLoginMiddleware } from './middleware/save-user-login.middleware';
import { UserService } from './api/user/application/user.service';
import { ConversationModule } from './api/conversation/conversation.module';
import { NotificationModule } from './api/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    ClientsModule.register([
      { name: 'API_LOG', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_LOG) || 3101 } },
      { name: 'API_MAIL', transport: Transport.TCP, options: { port: Number(process.env.PORT_API_MAIL || 3102) } },
    ]),
    CqrsModule,
    // ________ Module ________
    ApiMailModule,
    ApiLogModule,
    HealthCheckModule,
    ApiLandingPageModule,

    // ________ Module Application ________
    UserModule,
    AuthModule,
    ProfileModule,
    OccupationModule,
    SocialNetworkModule,
    CardModule,
    GroupModule,
    AddressModule,
    CompanyModule,
    MediaModule,
    ConversationModule,
    NotificationModule,
    // ________ Module to remove ________
    EntitiesToMoveModule,
  ],
  controllers: [AppController],
  providers: [AppService, ApiLogService, UserService],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware, ResponseLoggingMiddleware, ErrorLoggingMiddleware).forRoutes('*');
    consumer.apply(SaveUserLoginMiddleware).forRoutes('/auth/login');
  }
}
