import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CancelSubscriptionStripeEvent } from '../../event/cancel-subscription-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CancelSubscriptionStripeEvent)
export class CancelSubscriptionStripeEventHandler implements IEventHandler<CancelSubscriptionStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CancelSubscriptionStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body:
        'Cancel subscription stripe for customer with id ' +
        event.stripeCustomerId +
        ' and subscription id ' +
        event.subscriptionId,
    });
  }
}
