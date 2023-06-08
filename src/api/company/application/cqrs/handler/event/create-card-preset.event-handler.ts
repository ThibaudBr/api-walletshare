import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateCardPresetEvent } from '../../event/create-card-preset.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateCardPresetEvent)
export class CreateCardPresetEventHandler implements IEventHandler<CreateCardPresetEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateCardPresetEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Create card preset with id: ' + event.id + ' for company with id: ' + event.companyId,
    });
  }
}
