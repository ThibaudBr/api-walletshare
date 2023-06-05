import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveProductEvent } from '../../event/remove-product.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveProductEvent)
export class RemoveProductEventHandler implements IEventHandler<RemoveProductEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveProductEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Product removed with id: ' + event.id,
    });
  }
}
