import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ChargeStripeEvent } from '../../event/charge-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(ChargeStripeEvent)
export class ChargeStripeEventHandler implements IEventHandler<ChargeStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: ChargeStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.methode,
      module: event.module,
      body:
        ' Charge customer with id : ' +
        event.stripeCustomerId +
        ' and amount: ' +
        event.amount +
        ' and paymentMethodId: ' +
        event.paymentMethodId,
    });
  }
}
