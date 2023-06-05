import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CancelSubscriptionEvent } from '../../event/cancel-subscription.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CancelSubscriptionEvent)
export class CancelSubscriptionEventHandler implements IEventHandler<CancelSubscriptionEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CancelSubscriptionEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      body: 'Cancel of subscription with id ' + event.subscriptionId,
      module: event.module,
      method: event.method,
    });
  }
}
