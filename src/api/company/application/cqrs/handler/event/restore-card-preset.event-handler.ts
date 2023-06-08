import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestoreCardPresetEvent } from '../../event/restore-card-preset.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RestoreCardPresetEvent)
export class RestoreCardPresetEventHandler implements IEventHandler<RestoreCardPresetEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreCardPresetEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Restore card preset with id: ' + event.id,
    });
  }
}
