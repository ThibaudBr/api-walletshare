import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePriceStripeCommand } from '../../command/update-price-stripe.command';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { UpdatePriceStripeEvent } from '../../event/update-price-stripe.event';

@CommandHandler(UpdatePriceStripeCommand)
export class UpdatePriceStripeCommandHandler implements ICommandHandler<UpdatePriceStripeCommand> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') == 'prod') {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_PROD') ?? 'error', {
        apiVersion: '2022-11-15',
        maxNetworkRetries: 2,
      });
    } else {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST') ?? 'error', {
        apiVersion: '2022-11-15',
        maxNetworkRetries: 2,
      });
    }
  }

  async execute(command: UpdatePriceStripeCommand): Promise<Stripe.Price> {
    return await this.stripe.prices
      .update(command.priceStripeId, {
        active: true,
        metadata: {
          productId: command.productId,
          priceId: command.priceId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'UpdatePriceStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the update of the price');
      })
      .then(async (price: Stripe.Price) => {
        await this.eventBus.publish(
          new UpdatePriceStripeEvent({
            priceStripeId: price.id,
            productStripeId: price.product as string,
          }),
        );
        return price;
      });
  }
}
