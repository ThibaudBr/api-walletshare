import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ChargeStripeCommand } from '../../command/charge-stripe.command';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { ConfigService } from '@nestjs/config';

@CommandHandler(ChargeStripeCommand)
export class ChargeStripeCommandHandler implements ICommandHandler<ChargeStripeCommand> {
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

  async execute(command: ChargeStripeCommand): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.stripe.paymentIntents
      .create({
        amount: command.amount,
        customer: command.stripeCustomerId,
        payment_method: command.paymentMethodId,
        currency: this.configService.get('STRIPE_CURRENCY') ?? 'eur',
        off_session: true,
        confirm: true,
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'ChargeStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the charge of the customer');
      });
  }
}
