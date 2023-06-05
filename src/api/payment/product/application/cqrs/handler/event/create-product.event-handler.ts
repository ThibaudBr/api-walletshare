import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateProductEvent } from '../../event/create-product.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreateProductEvent)
export class CreateProductEventHandler implements IEventHandler<CreateProductEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateProductEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Product created with id: ' + event.productId + ' and stripeProductId: ' + event.stripeProductId,
    });
  }
}
