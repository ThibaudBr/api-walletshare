import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/domain/entities/user.entity';
import { SubscriptionEntity } from './domain/entities/subscription.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiLogModule } from '../../api-log/api-log.module';
import { StripeModule } from '../stripe/stripe.module';
import { SubscriptionController } from './web/subscription.controller';
import { StripeService } from '../stripe/application/stripe.service';
import { ApiLogService } from '../../api-log/application/api-log.service';
import { CreateLogCommandHandler } from '../../api-log/application/cqrs/handler/command/create-log.command-handler';
import { SubscriptionService } from './application/subscription.service';
import { HttpModule } from '@nestjs/axios';
import { PriceService } from '../price/application/price.service';
import { PriceModule } from '../price/price.module';
import { GetUserWithReferralCodeByUserIdQueryHandler } from './application/cqrs/handler/query/get-user-with-referral-code-by-user-id.query-handler';
import { GetAllActiveSubscriptionQueryHandler } from './application/cqrs/handler/query/get-all-active-subscription.query-handler';
import { ProfileEntity } from '../../profile/domain/entities/profile.entity';
import { AssignProfileToSubscriptionCommandHandler } from './application/cqrs/handler/command/assign-profile-to-subscription.command-handler';
import { CancelSubscriptionCommandHandler } from './application/cqrs/handler/command/cancel-subscription-command.handler';
import { CreateSubscriptionCommandHandler } from './application/cqrs/handler/command/create-subscription.command-handler';
import { CreateUsedReferralCodeCommandHandler } from './application/cqrs/handler/command/create-used-referral-code.command-handler';
import { RemoveProfileToSubscriptionCommandHandler } from './application/cqrs/handler/command/remove-profile-to-subscription.command-handler';
import { UpdateAccountStatusCommandHandler } from './application/cqrs/handler/command/update-account-status.command-handler';
import { AssignProfileToSubscriptionEventHandler } from './application/cqrs/handler/event/assign-profile-to-subscription.event-handler';
import { CancelSubscriptionEventHandler } from './application/cqrs/handler/event/cancel-subscription.event-handler';
import { CreateSubscriptionEventHandler } from './application/cqrs/handler/event/create-subscription.event-handler';
import { RemoveProfileToSubscriptionEventHandler } from './application/cqrs/handler/event/remove-profile-to-subscription.event-handler';
import { UpdateSubscriptionCommandHandler } from './application/cqrs/handler/command/update-subscription.command-handler';
import { UpdateSubscriptionEventHandler } from './application/cqrs/handler/event/update-subscription.event-handler';
import { UpdateAccountStatusEventHandler } from './application/cqrs/handler/event/update-account-status.event-handler';
import { CreateUsedReferralCodeEventHandler } from './application/cqrs/handler/event/create-used-referral-code.event-handler';
import { GetSubscriptionByStripeSubscriptionIdQueryHandler } from './application/cqrs/handler/query/get-subcription-by-stripe-subscription-id.query-handler';
import { PriceEntity } from '../price/domain/entities/price.entity';
import { ReferralCodeEntity } from '../../user/domain/entities/referral-code.entity';

@Module({
  controllers: [SubscriptionController],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, SubscriptionEntity, ProfileEntity, PriceEntity, ReferralCodeEntity]),
    CqrsModule,
    ApiLogModule,
    StripeModule,
    PriceModule,
    HttpModule,
  ],
  providers: [
    // Stripe module
    StripeService,
    // log
    ApiLogService,
    PriceService,
    CreateLogCommandHandler,
    // Subscription module
    SubscriptionService,
    // Command Handlers
    AssignProfileToSubscriptionCommandHandler,
    CancelSubscriptionCommandHandler,
    CreateSubscriptionCommandHandler,
    CreateUsedReferralCodeCommandHandler,
    RemoveProfileToSubscriptionCommandHandler,
    UpdateAccountStatusCommandHandler,
    UpdateSubscriptionCommandHandler,
    // Event Handlers
    AssignProfileToSubscriptionEventHandler,
    CancelSubscriptionEventHandler,
    CreateSubscriptionEventHandler,
    CreateUsedReferralCodeEventHandler,
    RemoveProfileToSubscriptionEventHandler,
    UpdateAccountStatusEventHandler,
    UpdateSubscriptionEventHandler,
    // Query Handlers
    GetAllActiveSubscriptionQueryHandler,
    GetUserWithReferralCodeByUserIdQueryHandler,
    GetSubscriptionByStripeSubscriptionIdQueryHandler,
  ],
})
export class SubscriptionModule {}
