import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { SubscriptionService } from '../../subscription/application/subscription.service';
import Stripe from 'stripe';
import { StripeService } from '../../stripe/application/stripe.service';
import { ProductService } from '../../product/application/product.service';
import { ProfileService } from '../../../profile/application/profile.service';
import { StripeEventTypeEnum } from '../domain/enum/stripe-event-type.enum';

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
    private readonly productService: ProductService,
    private readonly profileService: ProfileService,
  ) {}

  async processSubscription(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case StripeEventTypeEnum.SUBSCRIPTION_CREATED:
        throw new BadRequestException('Not implemented');
      case StripeEventTypeEnum.SUBSCRIPTION_UPDATED:
        throw new BadRequestException('Not implemented');
      case StripeEventTypeEnum.SUBSCRIPTION_DELETED:
        throw new BadRequestException('Not implemented');
      default:
        console.log(event);
        throw new BadRequestException('Invalid Stripe event type');
    }
  }
}
