import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateMonthlySubscriptionStatusEvent } from '../../event/update-monthly-subscription-status.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateMonthlySubscriptionStatusEvent)
export class UpdateMonthlySubscriptionStatusEventHandler
  implements IEventHandler<UpdateMonthlySubscriptionStatusEvent>
{
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateMonthlySubscriptionStatusEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.methode,
      body:
        'Update monthly subscription status for customer with id: ' +
        event.stripCustomerId +
        ' to: ' +
        event.subscriptionStatus,
    });
  }
}
