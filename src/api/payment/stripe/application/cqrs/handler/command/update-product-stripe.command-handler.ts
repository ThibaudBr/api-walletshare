import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductStripeCommand } from '../../command/update-product-stripe.command';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { UpdateProductStripeEvent } from '../../event/update-product-stripe.event';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(UpdateProductStripeCommand)
export class UpdateProductStripeCommandHandler implements ICommandHandler<UpdateProductStripeCommand> {
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

  async execute(command: UpdateProductStripeCommand): Promise<Stripe.Response<Stripe.Product>> {
    const updatedProduct: Stripe.Response<Stripe.Product> = await this.stripe.products
      .update(command.productStripeId, {
        name: command.name ? command.name : undefined,
        description: command.description ? command.description : undefined,
        default_price: command.defaultPriceId ? command.defaultPriceId : undefined,
        active: command.active ? command.active : undefined,
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'UpdateProductStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the update of the product');
      });

    await this.eventBus.publish(
      new UpdateProductStripeEvent({
        stripeProductId: updatedProduct.id,
      }),
    );

    return updatedProduct;
  }
}
