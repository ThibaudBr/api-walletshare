import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateUsedReferralCodeEvent } from '../../event/create-used-referral-code.event';
import { ApiLogService } from '../../../../../../api-log/application/api-log.service';

@EventsHandler(CreateUsedReferralCodeEvent)
export class CreateUsedReferralCodeEventHandler implements IEventHandler<CreateUsedReferralCodeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateUsedReferralCodeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      body: 'Create of used referral code with id ' + event.referralCodeId + ' for user with id ' + event.userId,
      module: event.module,
      method: event.method,
    });
  }
}
