import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateProductStripeEvent } from '../../event/create-product-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreateProductStripeEvent)
export class CreateProductStripeEventHandler implements IEventHandler<CreateProductStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateProductStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Create product stripe with id: ' + event.stripeProductId,
    });
  }
}
