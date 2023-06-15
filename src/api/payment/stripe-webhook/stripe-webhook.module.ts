import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/domain/entities/user.entity';
import StripeEventEntity from './domain/entities/stripe-event.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../../api-log/api-log.module';
import { StripeWebhookController } from './web/stripe-webhook.controller';
import { ApiLogService } from '../../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../../api-log/application/cqrs/handler/command/create-log.command-handler';
import { StripeWebhookService } from './application/stripe-webhook.service';
import { CreateStripeEventCommandHandler } from './application/cqrs/handler/command/create-stripe-event.command-handler';
import { CreateStripeEventEventHandler } from './application/cqrs/handler/event/create-stripe-event.event-handler';
import { SubscriptionService } from '../subscription/application/subscription.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { StripeService } from '../stripe/application/stripe.service';
import { HttpModule } from '@nestjs/axios';
import { PriceModule } from '../price/price.module';
import { PriceService } from '../price/application/price.service';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/application/product.service';
import { ProfileService } from '../../profile/application/profile.service';
import { ProfileModule } from '../../profile/profile.module';
import { GetUserByStripeCustomerIdQueryHandler } from './application/cqrs/handler/query/get-user-by-stripe-customer-id.query-handler';
import { InvoiceModule } from '../invoices/invoice.module';
import { InvoiceService } from '../invoices/application/invoice.service';
import { UserService } from '../../user/application/user.service';
import { UserModule } from '../../user/user.module';
import { ApiMailModule } from '../../api-mail/api-mail.module';
import { ApiMailService } from '../../api-mail/application/api-mail.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, StripeEventEntity]),
    CqrsModule,
    ApiLogModule,
    SubscriptionModule,
    PriceModule,
    ProductModule,
    ProfileModule,
    InvoiceModule,
    UserModule,
    HttpModule,
    ApiMailModule,
  ],
  providers: [
    ApiMailService,
    UserService,
    StripeService,
    InvoiceService,
    SubscriptionService,
    PriceService,
    ProductService,
    ProfileService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Stripe Webhook module
    StripeWebhookService,
    // Command Handlers
    CreateStripeEventCommandHandler,
    // Event Handlers
    CreateStripeEventEventHandler,
    // Query Handlers
    GetUserByStripeCustomerIdQueryHandler,
    // Subscription module
    SubscriptionService,
  ],
  controllers: [StripeWebhookController],
})
export class StripeWebhookModule {}
