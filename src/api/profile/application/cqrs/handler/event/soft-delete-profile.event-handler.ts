import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftDeleteProfileEvent } from '../../event/soft-delete-profile.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftDeleteProfileEvent)
export class SoftDeleteProfileEventHandler implements IEventHandler<SoftDeleteProfileEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftDeleteProfileEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Profile with id: ' + event.id + ' soft deleted',
    });
  }
}
