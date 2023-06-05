import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestorePriceEvent } from '../../event/restore-price.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(RestorePriceEvent)
export class RestorePriceEventHandler implements IEventHandler<RestorePriceEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestorePriceEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Restore price stripe with id: ' + event.priceId,
    });
  }
}
