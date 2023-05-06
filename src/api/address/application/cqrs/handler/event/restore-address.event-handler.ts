import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestoreAddressEvent } from '../../event/restore-address.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(RestoreAddressEvent)
export class RestoreAddressEventHandler implements IEventHandler<RestoreAddressEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreAddressEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Address with ID : ' + event.addressId + ' have been restored',
    });
  }
}
