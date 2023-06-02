import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateProductStripeEvent } from '../../event/update-product-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateProductStripeEvent)
export class UpdateProductStripeEventHandler implements IEventHandler<UpdateProductStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateProductStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Update plan stripe with id: ' + event.stripeProductId,
    });
  }
}
