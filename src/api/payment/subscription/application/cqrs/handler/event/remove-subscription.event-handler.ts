import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveSubscriptionEvent } from '../../event/remove-subscription.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveSubscriptionEvent)
export class RemoveSubscriptionEventHandler implements IEventHandler<RemoveSubscriptionEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveSubscriptionEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Subscription removed with id ' + event.subscriptionId,
    });
  }
}
