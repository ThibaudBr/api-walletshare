import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestoreOccupationEvent } from '../../event/restore-occupation.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(RestoreOccupationEvent)
export class RestoreOccupationEventHandler implements IEventHandler<RestoreOccupationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreOccupationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Occupation with id: ' + event.occupationId + ' have been restored',
    });
  }
}
