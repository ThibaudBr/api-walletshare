import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateSubscriptionEvent } from '../../event/update-subscription.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateSubscriptionEvent)
export class UpdateSubscriptionEventHandler implements IEventHandler<UpdateSubscriptionEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateSubscriptionEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Update subscription with id: ' + event.subscriptionId,
    });
  }
}
