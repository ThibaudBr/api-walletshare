import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemovePriceStripeEvent } from '../../event/remove-price-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(RemovePriceStripeEvent)
export class RemovePriceStripeEventHandler implements IEventHandler<RemovePriceStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemovePriceStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Remove price stripe with id: ' + event.priceStripeId,
    });
  }
}
