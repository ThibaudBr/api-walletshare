import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AttachCreditCardEvent } from '../../event/attach-credit-card.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(AttachCreditCardEvent)
export class AttachCreditCardEventHandler implements IEventHandler<AttachCreditCardEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: AttachCreditCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.methode,
      module: event.module,
      body:
        'Attach credit card for stripe customer id: ' +
        event.stripeCustomerId +
        ' with payment method id: ' +
        event.paymentMethodId,
    });
  }
}
