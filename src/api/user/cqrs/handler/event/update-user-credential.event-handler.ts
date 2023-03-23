import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../api-log/api-log.service';
import { UpdateUserCredentialEvent } from '../../event/update-user-credential.event';

@EventsHandler(UpdateUserCredentialEvent)
export class UpdateUserCredentialEventHandler implements IEventHandler<UpdateUserCredentialEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateUserCredentialEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with id: ' + event.userId + ' updated',
    });
  }
}
