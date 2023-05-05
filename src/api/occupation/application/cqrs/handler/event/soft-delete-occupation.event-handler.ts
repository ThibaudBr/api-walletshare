import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftDeleteOccupationEvent } from '../../event/soft-delete-occupation.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftDeleteOccupationEvent)
export class SoftDeleteOccupationEventHandler implements IEventHandler<SoftDeleteOccupationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftDeleteOccupationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Occupation with id: ' + event.occupationId + ' have been soft deleted',
    });
  }
}
