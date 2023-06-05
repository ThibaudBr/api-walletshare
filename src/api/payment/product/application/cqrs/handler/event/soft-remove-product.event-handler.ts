import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftRemoveProductEvent } from '../../event/soft-remove-product.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(SoftRemoveProductEvent)
export class SoftRemoveProductEventHandler implements IEventHandler<SoftRemoveProductEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftRemoveProductEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Product soft removed with id: ' + event.id,
    });
  }
}
