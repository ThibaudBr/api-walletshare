import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateProfileEvent } from '../../event/update-profile.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateProfileEvent)
export class UpdateProfileEventHandler implements IEventHandler<UpdateProfileEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateProfileEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Profile with id: ' + event.updateProfileCommand.id + ' updated',
    });
  }
}
