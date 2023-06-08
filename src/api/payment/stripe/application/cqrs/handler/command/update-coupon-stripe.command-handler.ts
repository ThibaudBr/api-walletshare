import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCouponStripeCommand } from '../../command/update-coupon-stripe.command';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(UpdateCouponStripeCommand)
export class UpdateCouponStripeCommandHandler implements ICommandHandler<UpdateCouponStripeCommand> {
  private stripe: Stripe;

  constructor(private readonly eventBus: EventBus, private readonly configService: ConfigService) {
    if (this.configService.get('NODE_ENV') == 'prod') {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_PROD') || 'error', {
        apiVersion: '2022-11-15',
      });
    } else {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST') || 'error', {
        apiVersion: '2022-11-15',
      });
    }
  }

  async execute(command: UpdateCouponStripeCommand): Promise<Stripe.Response<Stripe.Coupon>> {
    return await this.stripe.coupons
      .update(command.couponId, {})
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'UpdateCouponStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the update of the coupon');
      })
      .then(async coupon => {
        await this.eventBus.publish(
          new UpdateCouponStripeCommand({
            couponId: coupon.id,
          }),
        );
        return coupon;
      });
  }
}
