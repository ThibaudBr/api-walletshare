import Stripe from 'stripe';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { CreateCouponStripeCommand } from '../../command/create-coupon-stripe.command';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { CreateCouponStripeEvent } from '../../event/create-coupon-stripe.event';

@CommandHandler(CreateCouponStripeCommand)
export class CreateCouponStripeCommandHandler implements ICommandHandler<CreateCouponStripeCommand> {
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

  async execute(command: CreateCouponStripeCommand): Promise<Stripe.Response<Stripe.Coupon>> {
    return await this.stripe.coupons
      .create({
        applies_to: {
          products: command.productStripeIdList,
        },
        percent_off: command.percentOff,
        duration: 'once',
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'CreateCouponStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the creation of the coupon');
      })
      .then(async coupon => {
        await this.eventBus.publish(
          new CreateCouponStripeEvent({
            couponId: coupon.id,
          }),
        );
        return coupon;
      });
  }
}
