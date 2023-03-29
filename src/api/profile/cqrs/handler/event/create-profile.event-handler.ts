import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateProfileEvent } from '../../event/create-profile.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(CreateProfileEvent)
export class CreateProfileEventHandler implements IEventHandler<CreateProfileEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateProfileEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body:
        'Profile with id: ' + event.profileResponse.id + ' created for user with id: ' + event.profileResponse.userId,
    });
  }
}
