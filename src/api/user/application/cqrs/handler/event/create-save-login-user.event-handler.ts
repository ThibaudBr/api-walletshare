import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateSaveLoginEvent } from '../../event/create-save-login.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateSaveLoginEvent)
export class CreateSaveLoginUserEventHandler implements IEventHandler<CreateSaveLoginEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateSaveLoginEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with id: ' + event.userId + ' has logged in.',
    });
  }
}
