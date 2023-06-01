import { EventsHandler } from '@nestjs/cqrs';
import { CreateStripeEventEvent } from '../../event/create-stripe-event.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreateStripeEventEvent)
export class CreateStripeEventEventHandler {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateStripeEventEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Create strip event with id: ' + event.stripEventId,
    });
  }
}
