import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateAddressEvent } from '../../event/update-address.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateAddressEvent)
export class UpdateAddressEventHandler implements IEventHandler<UpdateAddressEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateAddressEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Address with ID : ' + event.addressId + ' have been updated',
    });
  }
}
