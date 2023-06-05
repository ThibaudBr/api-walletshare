import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateProductEvent } from '../../event/update-product.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateProductEvent)
export class UpdateProductEventHandler implements IEventHandler<UpdateProductEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateProductEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Product updated with id: ' + event.productId + ' and stripeProductId: ' + event.stripeProductId,
    });
  }
}
