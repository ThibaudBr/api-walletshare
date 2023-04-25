import { ApiLogService } from '../../../../../api-log/application/api-log.service';
import { DeleteProfileEvent } from '../../event/delete-profile.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(DeleteProfileEvent)
export class DeleteProfileEventHandler implements IEventHandler<DeleteProfileEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}
  async handle(event: DeleteProfileEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Profile with id: ' + event.id + ' deleted',
    });
  }
}
