import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCouponByIdStripeQuery } from '../../query/get-coupon-by-id-stripe.query';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetCouponByIdStripeQuery)
export class GetCouponByIdStripeQueryHandler implements IQueryHandler<GetCouponByIdStripeQuery> {
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

  async execute(query: GetCouponByIdStripeQuery): Promise<Stripe.Response<Stripe.Coupon>> {
    return await this.stripe.coupons.retrieve(query.couponId).catch(error => {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'payment', handler: 'GetCouponByIdStripeQueryHandler', error: error }),
      );
      throw new Error('Error during the retrieve of the coupon');
    });
  }
}
