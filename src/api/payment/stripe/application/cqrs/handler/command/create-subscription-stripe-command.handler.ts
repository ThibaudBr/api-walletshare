import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateSubscriptionStripeCommand } from '../../command/create-subscription-stripe.command';
import Stripe from 'stripe';
import { CreateSubscriptionStripeEvent } from '../../event/create-subscription-stripe.event';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { ConfigService } from '@nestjs/config';

@CommandHandler(CreateSubscriptionStripeCommand)
export class CreateSubscriptionStripeCommandHandler implements ICommandHandler<CreateSubscriptionStripeCommand> {
  private readonly stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') == 'prod') {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_PROD') || 'error', {
        apiVersion: '2022-11-15',
      });
    } else {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST') || 'error', {
        apiVersion: '2022-11-15',
      });
    }
  }

  async execute(command: CreateSubscriptionStripeCommand): Promise<Stripe.Response<Stripe.Subscription>> {
    if (command.trialPeriod) {
      const subscription: Stripe.Response<Stripe.Subscription> = await this.stripe.subscriptions
        .create({
          customer: command.stripeCustomerId,
          items: [{ price: command.priceId }],
          expand: ['latest_invoice.payment_intent'],
          trial_period_days: command.trialPeriod,
          promotion_code: command.promotionCode,
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
        promotion_code: command.promotionCode,
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
