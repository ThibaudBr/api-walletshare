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
import { UpdateMonthlySubscriptionStatusCommandHandler } from './application/cqrs/handler/command/update-monthly-subscription-status.command-handler';
import { UpdateMonthlySubscriptionStatusEventHandler } from './application/cqrs/handler/event/update-monthly-subscription-status.event-handler';
import { HttpModule } from '@nestjs/axios';
import { PriceService } from '../price/application/price.service';
import { PriceModule } from '../price/price.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, SubscriptionEntity]),
    CqrsModule,
    ApiLogModule,
    StripeModule,
    PriceModule,
    HttpModule,
  ],
  controllers: [SubscriptionController],
  providers: [
    // Stripe module
    StripeService,
    // log
    ApiLogService,
    PriceService,
    CreateLogCommandHandler,
    // Subscription module
    SubscriptionService,
    SubscriptionService,
    // Command Handlers
    UpdateMonthlySubscriptionStatusCommandHandler,
    // Event Handlers
    UpdateMonthlySubscriptionStatusEventHandler,
    // Query Handlers
  ],
})
export class SubscriptionModule {}
