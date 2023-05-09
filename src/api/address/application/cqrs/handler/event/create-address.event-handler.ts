import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateAddressEvent } from '../../event/create-address.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateAddressEvent)
export class CreateAddressEventHandler implements IEventHandler<CreateAddressEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateAddressEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Address with ID : ' + event.addressId + ' have been created',
    });
  }
}
