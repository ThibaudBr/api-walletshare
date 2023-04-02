import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateOccupationEvent } from '../../event/update-occupation.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(UpdateOccupationEvent)
export class UpdateOccupationEventHandler implements IEventHandler<UpdateOccupationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateOccupationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Occupation with id: ' + event.occupationId + ' have been updated',
    });
  }
}
