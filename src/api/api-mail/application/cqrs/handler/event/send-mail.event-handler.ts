import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SendMailEvent } from '../../event/send-mail.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SendMailEvent)
export class SendMailEventHandler implements IEventHandler<SendMailEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}
  async handle(event: SendMailEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Mail sent to: ' + event.email,
    });
  }
}
