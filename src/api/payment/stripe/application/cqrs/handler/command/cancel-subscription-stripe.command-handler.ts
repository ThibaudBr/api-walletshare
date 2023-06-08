import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CancelSubscriptionStripeCommand } from '../../command/cancel-subscription-stripe.command';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { CancelSubscriptionStripeEvent } from '../../event/cancel-subscription-stripe.event';

@CommandHandler(CancelSubscriptionStripeCommand)
export class CancelSubscriptionStripeCommandHandler implements ICommandHandler<CancelSubscriptionStripeCommand> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') == 'prod') {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_PROD') ?? 'error', {
        apiVersion: '2022-11-15',
      });
    } else {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST') ?? 'error', {
        apiVersion: '2022-11-15',
      });
    }
  }

  async execute(command: CancelSubscriptionStripeCommand): Promise<Stripe.Response<Stripe.Subscription>> {
    const subscription: Stripe.Response<Stripe.Subscription> = await this.stripe.subscriptions
      .cancel(command.subscriptionId)
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CancelSubscriptionStripeCommandHandler',
            localisation: 'stripe.subscriptions.del',
            error: error,
          }),
        );
        throw new Error('Error during the subscription cancelation');
      });

    await this.eventBus.publish(
      new CancelSubscriptionStripeEvent({
        stripeCustomerId: command.stripeCustomerId,
        subscriptionId: command.subscriptionId,
      }),
    );

    return subscription;
  }
}
