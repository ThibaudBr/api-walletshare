import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateOccupationEvent } from '../../event/create-occupation.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(CreateOccupationEvent)
export class CreateOccupationEventHandler implements IEventHandler<CreateOccupationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateOccupationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Occupation with id: ' + event.occupationId + ' have been created',
    });
  }
}
