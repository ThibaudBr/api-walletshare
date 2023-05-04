import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftRemoveAddressEvent } from '../../event/soft-remove-address.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftRemoveAddressEvent)
export class SoftRemoveAddressEventHandler implements IEventHandler<SoftRemoveAddressEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftRemoveAddressEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Address with ID : ' + event.addressId + ' have been soft removed',
    });
  }
}
