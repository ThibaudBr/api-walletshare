import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductStripeCommand } from '../../command/create-product-stripe.command';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { CreateProductStripeEvent } from '../../event/create-product-stripe.event';

@CommandHandler(CreateProductStripeCommand)
export class CreateProductStripeCommandHandler implements ICommandHandler<CreateProductStripeCommand> {
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

  async execute(command: CreateProductStripeCommand): Promise<Stripe.Response<Stripe.Product>> {
    const newStripeProduct: Stripe.Response<Stripe.Product> = await this.stripe.products
      .create({
        name: command.name,
        description: command.description,
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'CreatePlanStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the creation of the plan');
      });

    await this.eventBus.publish(
      new CreateProductStripeEvent({
        stripeProductId: newStripeProduct.id,
      }),
    );

    return newStripeProduct;
  }
}
