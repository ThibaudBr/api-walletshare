import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';
import { UpdatePriceStripeEvent } from '../../../../../stripe/application/cqrs/event/update-price-stripe.event';

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
