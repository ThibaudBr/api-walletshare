import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateOccupationsProfileEvent } from '../../event/update-occupations-profile.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateOccupationsProfileEvent)
export class UpdateOccupationsProfileEventHandler implements IEventHandler<UpdateOccupationsProfileEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}
  async handle(event: UpdateOccupationsProfileEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body:
        'Profile with id: ' +
        event.profileId +
        ' occupation have been updated with id: ' +
        event.listOfOccupationId.join(', '),
    });
  }
}
