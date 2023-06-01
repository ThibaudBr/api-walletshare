import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SetDefaultCreditCardStripeEvent } from '../../event/set-default-credit-card-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(SetDefaultCreditCardStripeEvent)
export class SetDefaultCreditCardStripeEventHandler implements IEventHandler<SetDefaultCreditCardStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SetDefaultCreditCardStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.methode,
      module: event.module,
      body:
        'Set default credit card stripe for customer with id ' +
        event.stripeCustomerId +
        ' and payment method id ' +
        event.paymentMethodId,
    });
  }
}
