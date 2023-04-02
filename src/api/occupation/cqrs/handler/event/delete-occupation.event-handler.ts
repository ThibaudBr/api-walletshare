import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteOccupationEvent } from '../../event/delete-occupation.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(DeleteOccupationEvent)
export class DeleteOccupationEventHandler implements IEventHandler<DeleteOccupationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: DeleteOccupationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Profile with id: ' + event.occupationId + ' have been deleted',
    });
  }
}
