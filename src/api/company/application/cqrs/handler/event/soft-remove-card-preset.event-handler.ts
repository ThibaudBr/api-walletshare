import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftRemoveCardPresetEvent } from '../../event/soft-remove-card-preset.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftRemoveCardPresetEvent)
export class SoftRemoveCardPresetEventHandler implements IEventHandler<SoftRemoveCardPresetEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftRemoveCardPresetEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Soft remove card preset with id: ' + event.id,
    });
  }
}
