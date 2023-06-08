import { DeleteCouponStripeCommand } from '../../command/delete-coupon-stripe.command';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(DeleteCouponStripeCommand)
export class DeleteCouponStripeCommandHandler implements ICommandHandler<DeleteCouponStripeCommand> {
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

  async execute(command: DeleteCouponStripeCommand): Promise<Stripe.Response<Stripe.DeletedCoupon>> {
    return await this.stripe.coupons
      .del(command.couponId)
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({ localisation: 'payment', handler: 'DeleteCouponStripeCommandHandler', error: error }),
        );
        throw new Error('Error during the deletion of the coupon');
      })
      .then(async coupon => {
        await this.eventBus.publish(
          new DeleteCouponStripeCommand({
            couponId: coupon.id,
          }),
        );
        return coupon;
      });
  }
}
