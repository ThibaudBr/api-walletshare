import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteCouponStripeEvent } from '../../event/delete-coupon-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(DeleteCouponStripeEvent)
export class DeleteCouponStripeEventHandler implements IEventHandler<DeleteCouponStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: DeleteCouponStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Coupon with id: ' + event.couponId + ' has been deleted',
    });
  }
}
