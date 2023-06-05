import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreatePriceStripeEvent } from '../../event/create-price-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreatePriceStripeEvent)
export class CreatePriceStripeEventHandler implements IEventHandler<CreatePriceStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreatePriceStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Create price stripe with id: ' + event.priceStripeId + ' and product id: ' + event.productId,
    });
  }
}
