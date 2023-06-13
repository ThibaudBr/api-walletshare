import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateInvoiceEvent } from '../../event/create-invoice.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreateInvoiceEvent)
export class CreateInvoiceEventHandler implements IEventHandler<CreateInvoiceEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateInvoiceEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body:
        'Invoice created with id ' +
        event.invoiceId +
        ' for user ' +
        event.userId +
        ' and subscription ' +
        event.subscriptionId,
    });
  }
}
