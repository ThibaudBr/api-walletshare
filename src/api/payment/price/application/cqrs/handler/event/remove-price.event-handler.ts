import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemovePriceEvent } from '../../event/remove-price.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(RemovePriceEvent)
export class RemovePriceEventHandler implements IEventHandler<RemovePriceEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemovePriceEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Remove price stripe with id: ' + event.priceId,
    });
  }
}
