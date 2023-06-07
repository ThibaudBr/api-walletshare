import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfiguration } from './util/config/database.configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import HealthCheckModule from './api/health-check/health-check.module';
import { EntitiesToMoveModule } from './api/entities-to-create/entities-to-move.module';
import { UserModule } from './api/user/user.module';
import { ApiLogModule } from './api/api-log/api-log.module';
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
import { AddressModule } from './api/address/address.module';
import { CompanyModule } from './api/company/company.module';
import { MediaModule } from './api/media/media.module';
import { SaveUserLoginMiddleware } from './middleware/save-user-login.middleware';
import { UserService } from './api/user/application/user.service';
import { ConversationModule } from './api/conversation/conversation.module';
import { NotificationModule } from './api/notification/notification.module';
import * as Joi from 'joi';
import { SubscriptionModule } from './api/payment/subscription/subscriptionModule';
import { StripeWebhookModule } from './api/payment/stripe-webhook/stripe-webhook.module';
import { StripeModule } from './api/payment/stripe/stripe.module';
import { ProductModule } from './api/payment/product/product.module';
import { PriceModule } from './api/payment/price/price.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        API_NAME: Joi.string().required(),
        VERBOSE: Joi.string().required(),
        VERBOSE_LOG: Joi.string().required(),
        LOG_REQUEST_BOOL: Joi.bool().required(),
        LOG_RESPONSE_BOOL: Joi.bool().required(),
        LOG_ERROR_BOOL: Joi.bool().required(),
        PORT: Joi.number().required(),
        HOST_API_LOG: Joi.string().required(),
        HOST_API_MAIL: Joi.string().required(),
        HOST_API_WAITING_LIST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        LENGTH_REFERRAL_CODE: Joi.number().required(),
        CACHE_MEDIA_NUMBER_POOL_MAX: Joi.number().required(),
        CACHE_MEDIA_MAX_DURATION: Joi.number().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PRIVATE_BUCKET_NAME: Joi.string().required(),
        AWS_SIGNED_URL_EXPIRATION: Joi.number().required(),
        AWS_MAX_FILE_SIZE_KILO: Joi.number().required(),
        PASSWORD_SUPER_ADMIN: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID: Joi.string().required(),
        STRIP_MONTHLY_TRIAL_PERIOD_DAYS: Joi.number().required(),
        STRIPE_WEBHOOK_SECRET: Joi.string().required(),
        STRIPE_CURRENCY: Joi.string().required(),
        STRIPE_SECRET_KEY_TEST: Joi.string().required(),
        STRIPE_SECRET_KEY_PROD: Joi.string().required(),
        API_LOG_TOKEN: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DatabaseConfiguration,
    }),
    HttpModule,
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
    SubscriptionModule,
    StripeWebhookModule,
    StripeModule,
    ProductModule,
    PriceModule,
    // ________ Module to remove ________
    EntitiesToMoveModule,
  ],
  providers: [AppService, ApiLogService, UserService],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware, ResponseLoggingMiddleware, ErrorLoggingMiddleware).forRoutes('*');
    consumer.apply(SaveUserLoginMiddleware).forRoutes('/auth/login');
  }
}
