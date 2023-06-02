import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestoreProductEvent } from '../../event/restore-product.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(RestoreProductEvent)
export class RestoreProductEventHandler implements IEventHandler<RestoreProductEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreProductEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Product with id: ' + event.id + ' has been restored',
    });
  }
}
