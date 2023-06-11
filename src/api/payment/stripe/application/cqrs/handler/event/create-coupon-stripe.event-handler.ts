import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateCouponStripeEvent } from '../../event/create-coupon-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreateCouponStripeEvent)
export class CreateCouponStripeEventHandler implements IEventHandler<CreateCouponStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateCouponStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Coupon with id: ' + event.couponId + ' has been created',
    });
  }
}