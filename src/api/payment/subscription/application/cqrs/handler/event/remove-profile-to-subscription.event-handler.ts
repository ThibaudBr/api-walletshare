import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveProfileToSubscriptionEvent } from '../../event/remove-profile-to-subscription.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveProfileToSubscriptionEvent)
export class RemoveProfileToSubscriptionEventHandler implements IEventHandler<RemoveProfileToSubscriptionEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveProfileToSubscriptionEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Remove Profile with id: ' + event.profileId + ' to Subscription with id: ' + event.subscriptionId,
    });
  }
}
