import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateSubscriptionEvent } from '../../event/create-subscription.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreateSubscriptionEvent)
export class CreateSubscriptionEventHandler implements IEventHandler<CreateSubscriptionEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateSubscriptionEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: 'CreateSubscriptionEventHandler',
      body: 'Subscription created with id ' + event.subscriptionId + ' for user ' + event.userId,
      module: 'subscription',
    });
  }
}
