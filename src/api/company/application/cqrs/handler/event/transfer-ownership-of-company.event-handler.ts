import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransferOwnershipOfCompanyEvent } from '../../event/transfer-ownership-of-company.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(TransferOwnershipOfCompanyEvent)
export class TransferOwnershipOfCompanyEventHandler implements IEventHandler<TransferOwnershipOfCompanyEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: TransferOwnershipOfCompanyEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Company with ID : ' + event.companyId + ' have been updated',
    });
  }
}
