import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreatePriceStripeEvent } from '../../event/create-price-stripe.event';
import { CreatePriceStripeCommand } from '../../command/create-price-stripe.command';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(CreatePriceStripeCommand)
export class CreatePriceStripeCommandHandler implements ICommandHandler<CreatePriceStripeCommand> {
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

  async execute(command: CreatePriceStripeCommand): Promise<Stripe.Price> {
    return await this.stripe.prices
      .create({
        unit_amount: command.unitAmount,
        currency: this.configService.get('STRIPE_CURRENCY') ?? 'eur',
        product: command.productStripeId,
        recurring: {
          interval: command.interval === 'month' ? 'month' : 'year',
          usage_type: command.usageType == 'licensed' ? 'licensed' : 'metered',
          interval_count: command.intervalCount,
          trial_period_days: command.trialPeriodDays,
        },
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'CreatePriceStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the creation of the price');
      })
      .then(async (price: Stripe.Price) => {
        await this.eventBus.publish(
          new CreatePriceStripeEvent({
            priceStripeId: price.id,
            productId: command.productId,
          }),
        );
        return price;
      });
  }
}
