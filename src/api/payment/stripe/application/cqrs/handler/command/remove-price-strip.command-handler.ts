import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemovePriceStripeCommand } from '../../command/remove-price-stripe.command';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { RemovePriceStripeEvent } from '../../event/remove-price-stripe.event';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemovePriceStripeCommand)
export class RemovePriceStripCommandHandler implements ICommandHandler<RemovePriceStripeCommand> {
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

  async execute(command: RemovePriceStripeCommand): Promise<Stripe.Price> {
    return await this.stripe.prices
      .update(command.priceStripeId, {
        active: false,
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'RemovePriceStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the remove of the price');
      })
      .then(async (price: Stripe.Price) => {
        await this.eventBus.publish(
          new RemovePriceStripeEvent({
            priceStripeId: price.id,
          }),
        );
        return price;
      });
  }
}
