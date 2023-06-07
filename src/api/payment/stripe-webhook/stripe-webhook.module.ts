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
import { UpdateMonthlySubscriptionStatusCommandHandler } from '../subscription/application/cqrs/handler/command/update-monthly-subscription-status.command-handler';
import { UpdateMonthlySubscriptionStatusEventHandler } from '../subscription/application/cqrs/handler/event/update-monthly-subscription-status.event-handler';
import { SubscriptionModule } from '../subscription/subscriptionModule';
import { StripeService } from '../stripe/application/stripe.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, StripeEventEntity]),
    CqrsModule,
    ApiLogModule,
    SubscriptionModule,
    HttpModule,
  ],
  controllers: [StripeWebhookController],
  providers: [
    StripeService,
    SubscriptionService,
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Stripe Webhook module
    StripeWebhookService,
    // Command Handlers
    CreateStripeEventCommandHandler,
    // Event Handlers
    CreateStripeEventEventHandler,
    // Subscription module
    SubscriptionService,
    // Command Handlers
    UpdateMonthlySubscriptionStatusCommandHandler,
    // Event Handlers
    UpdateMonthlySubscriptionStatusEventHandler,
    // Query Handlers
  ],
})
export class StripeWebhookModule {}
