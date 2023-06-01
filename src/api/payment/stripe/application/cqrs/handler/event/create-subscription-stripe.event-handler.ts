import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateSubscriptionStripeEvent } from '../../event/create-subscription-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreateSubscriptionStripeEvent)
export class CreateSubscriptionStripeEventHandler implements IEventHandler<CreateSubscriptionStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateSubscriptionStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.methode,
      module: event.module,
      body:
        'Create subscription stripe for customer with id ' + event.stripeCustomerId + ' and price of ' + event.priceId,
    });
  }
}
