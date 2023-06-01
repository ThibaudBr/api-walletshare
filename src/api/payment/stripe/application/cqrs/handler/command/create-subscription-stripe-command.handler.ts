import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateSubscriptionStripeCommand } from '../../command/create-subscription-stripe.command';
import Stripe from 'stripe';
import { CreateSubscriptionStripeEvent } from '../../event/create-subscription-stripe.event';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { ConfigService } from '@nestjs/config';

@CommandHandler(CreateSubscriptionStripeCommand)
export class CreateSubscriptionStripeCommandHandler implements ICommandHandler<CreateSubscriptionStripeCommand> {
  private readonly stripe: Stripe;
  private readonly trialPeriod: number;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') || 'error', {
      apiVersion: '2022-11-15',
    });
    this.trialPeriod = this.configService.get('STRIP_MONTHLY_TRIAL_PERIOD_DAYS') || 30;
  }

  async execute(command: CreateSubscriptionStripeCommand): Promise<Stripe.Response<Stripe.Subscription>> {
    if (command.trialPeriod) {
      const subscription: Stripe.Response<Stripe.Subscription> = await this.stripe.subscriptions
        .create({
          customer: command.stripeCustomerId,
          items: [{ price: command.priceId }],
          expand: ['latest_invoice.payment_intent'],
          trial_period_days: this.trialPeriod,
        })
        .catch(async error => {
          await this.eventBus.publish(
            new ErrorCustomEvent({
              handler: 'CreateSubscriptionStripCommandHandler',
              localisation: 'stripe.subscriptions.create',
              error: error,
            }),
          );
          throw new Error('Error during the subscription creation');
        });

      await this.eventBus.publish(
        new CreateSubscriptionStripeEvent({
          stripeCustomerId: command.stripeCustomerId,
          priceId: command.priceId,
        }),
      );

      return subscription;
    }
    const subscription: Stripe.Response<Stripe.Subscription> = await this.stripe.subscriptions
      .create({
        customer: command.stripeCustomerId,
        items: [{ price: command.priceId }],
        expand: ['latest_invoice.payment_intent'],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateSubscriptionStripCommandHandler',
            localisation: 'stripe.subscriptions.create',
            error: error,
          }),
        );
        throw new Error('Error during the subscription creation');
      });

    await this.eventBus.publish(
      new CreateSubscriptionStripeEvent({
        stripeCustomerId: command.stripeCustomerId,
        priceId: command.priceId,
      }),
    );

    return subscription;
  }
}
