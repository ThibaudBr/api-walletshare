import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftRemovePriceEvent } from '../../event/soft-remove-price.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(SoftRemovePriceEvent)
export class SoftRemovePriceEventHandler implements IEventHandler<SoftRemovePriceEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftRemovePriceEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Soft remove price stripe with id: ' + event.priceId,
    });
  }
}
