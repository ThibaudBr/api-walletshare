import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';
import { RestoreProfileEvent } from '../../event/restore-profile.event';

@EventsHandler(RestoreProfileEvent)
export class RestoreProfileEventHandler implements IEventHandler<RestoreProfileEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreProfileEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Profile with id: ' + event.profileId + ' have been restored',
    });
  }
}
