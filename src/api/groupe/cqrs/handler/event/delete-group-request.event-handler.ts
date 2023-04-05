import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteGroupRequestEvent } from '../../event/delete-group-request.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(DeleteGroupRequestEvent)
export class DeleteGroupRequestEventHandler implements IEventHandler<DeleteGroupRequestEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: DeleteGroupRequestEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: event.id,
    });
  }
}
