import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteMailEvent } from '../../event/delete-mail.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(DeleteMailEvent)
export class DeleteMailEventHandler implements IEventHandler<DeleteMailEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: DeleteMailEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: 'api-landing-page',
      method: 'delete-mail',
      body: 'delete user with mail : ' + event.deleteMailDto.mail,
    });
  }
}
