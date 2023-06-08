import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveCardPresetEvent } from '../../event/remove-card-preset.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveCardPresetEvent)
export class RemoveCardPresetEventHandler implements IEventHandler<RemoveCardPresetEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveCardPresetEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Remove card preset with id: ' + event.id,
    });
  }
}
