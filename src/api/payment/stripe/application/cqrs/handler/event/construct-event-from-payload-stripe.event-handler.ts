import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ConstructEventFromPayloadStripeEvent } from '../../event/construct-event-from-payload-stripe.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(ConstructEventFromPayloadStripeEvent)
export class ConstructEventFromPayloadStripeEventHandler
  implements IEventHandler<ConstructEventFromPayloadStripeEvent>
{
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: ConstructEventFromPayloadStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.methode,
      module: event.module,
      body: 'Construct event from payload stripe with signature ' + event.signature,
    });
  }
}
