import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { SubscriptionService } from '../../subscription/application/subscription.service';
import { CreateStripeEventCommand } from './cqrs/command/create-stripe-event.command';
import Stripe from 'stripe';
import { StripeEventTypeEnum } from '../domain/enum/stripe-event-type.enum';

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private subscriptionService: SubscriptionService,
  ) {}

  async processSubscriptionUpdate(event: Stripe.Event): Promise<void> {
    await this.commandBus
      .execute(
        new CreateStripeEventCommand({
          stripEventId: event.id,
        }),
      )
      .catch(async (error: Error) => {
        if (error.message === 'StripEvent already exist') {
          return;
        }
      });

    const data: Stripe.Subscription = event.data.object as Stripe.Subscription;

    const customerId: string = data.customer as string;
    const subscriptionStatus: Stripe.Subscription.Status = data.status;

    await this.subscriptionService.updateMonthlySubscriptionStatus(customerId, subscriptionStatus);
  }
}
