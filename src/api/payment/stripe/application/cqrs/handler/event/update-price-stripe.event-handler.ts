import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdatePriceStripeEvent } from '../../event/update-price-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(UpdatePriceStripeEvent)
export class UpdatePriceStripeEventHandler implements IEventHandler<UpdatePriceStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdatePriceStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body:
        'Update price stripe with id: ' + event.priceStripeId + ' for product stripe with id: ' + event.productStripeId,
    });
  }
}
