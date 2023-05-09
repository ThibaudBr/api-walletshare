import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveAddressEvent } from '../../event/remove-address.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RemoveAddressEvent)
export class RemoveAddressEventHandler implements IEventHandler<RemoveAddressEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RemoveAddressEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Address with ID : ' + event.addressId + ' have been removed',
    });
  }
}
