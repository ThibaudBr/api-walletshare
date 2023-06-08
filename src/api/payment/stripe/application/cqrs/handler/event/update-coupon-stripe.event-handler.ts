import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateCouponStripeEvent } from '../../event/update-coupon-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateCouponStripeEvent)
export class UpdateCouponStripeEventHandler implements IEventHandler<UpdateCouponStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateCouponStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Coupon with id: ' + event.couponId + ' has been updated',
    });
  }
}
