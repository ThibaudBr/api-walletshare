import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreatePriceEvent } from '../../event/create-price.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreatePriceEvent)
export class CreatePriceEventHandler implements IEventHandler<CreatePriceEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreatePriceEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Create price stripe with id: ' + event.priceStripeId + ' for product stripe with id: ' + event.productId,
    });
  }
}
