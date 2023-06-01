import { Module } from '@nestjs/common';
import { StripeService } from './stripe/application/stripe.service';
import { ApiLogService } from '../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../api-log/application/cqrs/handler/command/create-log.command-handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreateStripeCustomerCommandHandler } from './stripe/application/cqrs/handler/command/create-stripe-customer.command-handler';
import { CreateStripeCustomerEventHandler } from './stripe/application/cqrs/handler/event/create-stripe-customer.event-handler';
import { IsUserIdOwnerOfStripeCustomerIdQueryQueryHandler } from './stripe/application/cqrs/handler/query/is-user-id-owner-of-stripe-customer-id-query.query-handler';
import { StripeController } from './stripe/web/stripe.controller';
import StripeEventEntity from './stripe-webhook/domain/entities/stripe-event.entity';
import { StripeWebhookService } from './stripe-webhook/application/stripe-webhook.service';
import { SubscriptionService } from './subscription/application/subscription.service';
import { StripeWebhookController } from './stripe-webhook/web/stripe-webhook.controller';
import { SubscriptionController } from './subscription/web/subscription.controller';
import { AttachCreditCardCommandHandler } from './stripe/application/cqrs/handler/command/attach-credit-card.command-handler';
import { ChargeStripeCommandHandler } from './stripe/application/cqrs/handler/command/charge-stripe.command-handler';
import { CreateSubscriptionStripeCommandHandler } from './stripe/application/cqrs/handler/command/create-subscription-stripe-command.handler';
import { SetDefaultCreditCardStripeCommandHandler } from './stripe/application/cqrs/handler/command/set-default-credit-card-stripe.command-handler';
import { AttachCreditCardEventHandler } from './stripe/application/cqrs/handler/event/attach-credit-card.event-handler';
import { ChargeStripeEventHandler } from './stripe/application/cqrs/handler/event/charge-stripe.event-handler';
import { ConstructEventFromPayloadStripeEventHandler } from './stripe/application/cqrs/handler/event/construct-event-from-payload-stripe.event-handler';
import { ConstructEventFromPayloadStripeCommandHandler } from './stripe/application/cqrs/handler/command/construct-event-from-payload-stripe.command-handler';
import { CreateSubscriptionStripeEventHandler } from './stripe/application/cqrs/handler/event/create-subscription-stripe.event-handler';
import { SetDefaultCreditCardStripeEventHandler } from './stripe/application/cqrs/handler/event/set-default-credit-card-stripe.event-handler';
import { GetListSavedCreditCardOfUserQueryHandler } from './stripe/application/cqrs/handler/query/get-list-saved-credit-card-of-user.query-handler';
import { GetListSubscriptionStripeQueryHandler } from './stripe/application/cqrs/handler/query/get-list-subscription-stripe.query-handler';
import { CreateStripeEventCommandHandler } from './stripe-webhook/application/cqrs/handler/command/create-stripe-event.command-handler';
import { CreateStripeEventEventHandler } from './stripe-webhook/application/cqrs/handler/event/create-stripe-event.event-handler';
import { UpdateMonthlySubscriptionStatusCommandHandler } from './subscription/application/cqrs/handler/command/update-monthly-subscription-status.command-handler';
import { UpdateMonthlySubscriptionStatusEventHandler } from './subscription/application/cqrs/handler/event/update-monthly-subscription-status.event-handler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, StripeEventEntity]),
    CqrsModule,
    ApiLogModule,
    ClientsModule.register([
      {
        name: 'API_LOG',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST_API_LOG || 'localhost',
          port: Number(process.env.PORT_API_LOG) || 3101,
        },
      },
    ]),
  ],
  controllers: [StripeController, StripeWebhookController, SubscriptionController],
  providers: [
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Stripe module
    StripeService,
    // Command Handlers
    AttachCreditCardCommandHandler,
    ChargeStripeCommandHandler,
    ConstructEventFromPayloadStripeCommandHandler,
    CreateStripeCustomerCommandHandler,
    CreateSubscriptionStripeCommandHandler,
    SetDefaultCreditCardStripeCommandHandler,
    // Event Handlers
    AttachCreditCardEventHandler,
    ChargeStripeEventHandler,
    ConstructEventFromPayloadStripeEventHandler,
    CreateStripeCustomerEventHandler,
    CreateSubscriptionStripeEventHandler,
    SetDefaultCreditCardStripeEventHandler,
    // Query Handlers
    GetListSavedCreditCardOfUserQueryHandler,
    GetListSubscriptionStripeQueryHandler,
    IsUserIdOwnerOfStripeCustomerIdQueryQueryHandler,
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
export class PaymentModule {}
