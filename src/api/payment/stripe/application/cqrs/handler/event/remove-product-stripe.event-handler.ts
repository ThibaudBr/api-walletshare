import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveProductStripeEvent } from '../../event/remove-product-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveProductStripeEvent)
export class RemoveProductStripeEventHandler implements IEventHandler<RemoveProductStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveProductStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Remove product stripe with id: ' + event.stripeProductId,
    });
  }
}
