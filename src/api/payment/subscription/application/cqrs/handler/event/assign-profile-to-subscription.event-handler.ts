import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AssignProfileToSubscriptionEvent } from '../../event/assign-profile-to-subscription.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(AssignProfileToSubscriptionEvent)
export class AssignProfileToSubscriptionEventHandler implements IEventHandler<AssignProfileToSubscriptionEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AssignProfileToSubscriptionEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Assign profile with id ' + event.profileId + ' to subscription with id ' + event.subscriptionId,
    });
  }
}
