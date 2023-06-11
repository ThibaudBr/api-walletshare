import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SetReferralCodeEvent } from '../../event/set-referral-code.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SetReferralCodeEvent)
export class SetReferralCodeEventHandler implements IEventHandler<SetReferralCodeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SetReferralCodeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      body: 'Referral code set for user with id: ' + event.userId + ' and referral code id: ' + event.referralCodeId,
      method: event.method,
      module: event.module,
    });
  }
}
