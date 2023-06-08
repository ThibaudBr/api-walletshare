import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateCardPresetEvent } from '../../event/update-card-preset.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateCardPresetEvent)
export class UpdateCardPresetEventHandler implements IEventHandler<UpdateCardPresetEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateCardPresetEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Update card preset with id: ' + event.id,
    });
  }
}
