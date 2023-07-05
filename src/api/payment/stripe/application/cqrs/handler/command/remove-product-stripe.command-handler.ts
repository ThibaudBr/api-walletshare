import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProductStripeCommand } from '../../command/remove-product-stripe.command';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { RemoveProductStripeEvent } from '../../event/remove-product-stripe.event';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveProductStripeCommand)
export class RemoveProductStripeCommandHandler implements ICommandHandler<RemoveProductStripeCommand> {
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

  async execute(command: RemoveProductStripeCommand): Promise<Stripe.Response<Stripe.DeletedProduct>> {
    const deletedProduct: Stripe.Response<Stripe.DeletedProduct> = await this.stripe.products
      .del(command.id)
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'RemoveProductStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the deletion of the product');
      });

    await this.eventBus.publish(
      new RemoveProductStripeEvent({
        stripeProductId: deletedProduct.id,
      }),
    );

    return deletedProduct;
  }
}
