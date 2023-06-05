import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../../api-log/api-log.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StripeController } from './web/stripe.controller';
import { ApiLogService } from '../../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../../api-log/application/cqrs/handler/command/create-log.command-handler';
import { StripeService } from './application/stripe.service';
import { AttachCreditCardCommandHandler } from './application/cqrs/handler/command/attach-credit-card.command-handler';
import { ChargeStripeCommandHandler } from './application/cqrs/handler/command/charge-stripe.command-handler';
import { ConstructEventFromPayloadStripeCommandHandler } from './application/cqrs/handler/command/construct-event-from-payload-stripe.command-handler';
import { CreateStripeCustomerCommandHandler } from './application/cqrs/handler/command/create-stripe-customer.command-handler';
import { CreateSubscriptionStripeCommandHandler } from './application/cqrs/handler/command/create-subscription-stripe-command.handler';
import { SetDefaultCreditCardStripeCommandHandler } from './application/cqrs/handler/command/set-default-credit-card-stripe.command-handler';
import { AttachCreditCardEventHandler } from './application/cqrs/handler/event/attach-credit-card.event-handler';
import { ChargeStripeEventHandler } from './application/cqrs/handler/event/charge-stripe.event-handler';
import { ConstructEventFromPayloadStripeEventHandler } from './application/cqrs/handler/event/construct-event-from-payload-stripe.event-handler';
import { CreateStripeCustomerEventHandler } from './application/cqrs/handler/event/create-stripe-customer.event-handler';
import { CreateSubscriptionStripeEventHandler } from './application/cqrs/handler/event/create-subscription-stripe.event-handler';
import { SetDefaultCreditCardStripeEventHandler } from './application/cqrs/handler/event/set-default-credit-card-stripe.event-handler';
import { GetListSavedCreditCardOfUserQueryHandler } from './application/cqrs/handler/query/get-list-saved-credit-card-of-user.query-handler';
import { GetListSubscriptionStripeQueryHandler } from './application/cqrs/handler/query/get-list-subscription-stripe.query-handler';
import { IsUserIdOwnerOfStripeCustomerIdQueryQueryHandler } from './application/cqrs/handler/query/is-user-id-owner-of-stripe-customer-id-query.query-handler';
import { CancelSubscriptionStripeCommandHandler } from './application/cqrs/handler/command/cancel-subscription-stripe.command-handler';
import { CreateProductStripeCommandHandler } from './application/cqrs/handler/command/create-product-stripe.command-handler';
import { RemoveProductStripeCommandHandler } from './application/cqrs/handler/command/remove-product-stripe.command-handler';
import { UpdateProductStripeCommandHandler } from './application/cqrs/handler/command/update-product-stripe.command-handler';
import { CancelSubscriptionStripeEventHandler } from './application/cqrs/handler/event/cancel-subscription-stripe.event-handler';
import { CreateProductStripeEventHandler } from './application/cqrs/handler/event/create-product-stripe.event-handler';
import { RemoveProductStripeEventHandler } from './application/cqrs/handler/event/remove-product-stripe.event-handler';
import { UpdateProductStripeEventHandler } from './application/cqrs/handler/event/update-product-stripe.event-handler';
import { GetAllProductStripeQueryHandler } from './application/cqrs/handler/query/get-all-product-stripe.query-handler';
import { GetProductStripeByIdQueryHandler } from './application/cqrs/handler/query/get-product-stripe-by-id-query.handler';
import { CreatePriceStripeCommandHandler } from './application/cqrs/handler/command/create-price-stripe.command-handler';
import { RemovePriceStripCommandHandler } from './application/cqrs/handler/command/remove-price-strip.command-handler';
import { UpdatePriceStripeCommandHandler } from './application/cqrs/handler/command/update-price-stripe.command-handler';
import { CreatePriceStripeEventHandler } from './application/cqrs/handler/event/create-price-stripe.event-handler';
import { RemovePriceStripeEventHandler } from './application/cqrs/handler/event/remove-price-stripe.event-handler';
import { UpdatePriceStripeEventHandler } from './application/cqrs/handler/event/update-price-stripe.event-handler';
import { GetAllPriceStripeQueryHandler } from './application/cqrs/handler/query/get-all-price-stripe.query-handler';
import { GetPriceByIdStripeQueryHandler } from './application/cqrs/handler/query/get-price-by-id-stripe.query-handler';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
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
  controllers: [StripeController],
  providers: [
    // log
    ApiLogService,
    CreateLogCommandHandler,
    // Stripe module
    StripeService,
    // Command Handlers
    AttachCreditCardCommandHandler,
    CancelSubscriptionStripeCommandHandler,
    ChargeStripeCommandHandler,
    ConstructEventFromPayloadStripeCommandHandler,
    CreatePriceStripeCommandHandler,
    CreateProductStripeCommandHandler,
    CreateStripeCustomerCommandHandler,
    CreateSubscriptionStripeCommandHandler,
    RemovePriceStripCommandHandler,
    RemoveProductStripeCommandHandler,
    SetDefaultCreditCardStripeCommandHandler,
    UpdatePriceStripeCommandHandler,
    UpdateProductStripeCommandHandler,
    // Event Handlers
    AttachCreditCardEventHandler,
    CancelSubscriptionStripeEventHandler,
    ChargeStripeEventHandler,
    ConstructEventFromPayloadStripeEventHandler,
    CreatePriceStripeEventHandler,
    CreateProductStripeEventHandler,
    CreateStripeCustomerEventHandler,
    CreateSubscriptionStripeEventHandler,
    RemovePriceStripeEventHandler,
    RemoveProductStripeEventHandler,
    SetDefaultCreditCardStripeEventHandler,
    UpdatePriceStripeEventHandler,
    UpdateProductStripeEventHandler,
    // Query Handlers
    GetAllPriceStripeQueryHandler,
    GetAllProductStripeQueryHandler,
    GetListSavedCreditCardOfUserQueryHandler,
    GetListSubscriptionStripeQueryHandler,
    GetPriceByIdStripeQueryHandler,
    GetProductStripeByIdQueryHandler,
    IsUserIdOwnerOfStripeCustomerIdQueryQueryHandler,
  ],
})
export class StripeModule {}
