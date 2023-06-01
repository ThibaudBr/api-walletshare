import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SetDefaultCreditCardStripeCommand } from '../../command/set-default-credit-card-stripe.command';
import Stripe from 'stripe';
import { SetDefaultCreditCardStripeEvent } from '../../event/set-default-credit-card-stripe.event';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { ConfigService } from '@nestjs/config';

@CommandHandler(SetDefaultCreditCardStripeCommand)
export class SetDefaultCreditCardStripeCommandHandler implements ICommandHandler<SetDefaultCreditCardStripeCommand> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') || 'error', {
      apiVersion: '2022-11-15',
    });
  }

  async execute(command: SetDefaultCreditCardStripeCommand): Promise<Stripe.Response<Stripe.Customer>> {
    const defaultCard: Stripe.Response<Stripe.Customer> = await this.stripe.customers
      .update(command.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: command.paymentMethodId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'payment',
            handler: 'SetDefaultCreditCardStripCommandHandler',
            error: error,
          }),
        );
        throw new Error('Error during the set default credit card of the customer');
      });

    await this.eventBus.publish(
      new SetDefaultCreditCardStripeEvent({
        paymentMethodId: command.paymentMethodId,
        stripeCustomerId: command.stripeCustomerId,
      }),
    );
    return defaultCard;
  }
}
