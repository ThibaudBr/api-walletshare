import {ApiLogService} from "../../../../../../api-log/application/api-log.service";
import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {CreateReferralCodeStripeEvent} from "../../event/create-referral-code-stripe.event";

@EventsHandler(CreateReferralCodeStripeEvent)
export class CreateReferralCodeStripeEventHandler implements IEventHandler<CreateReferralCodeStripeEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateReferralCodeStripeEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Create referral code stripe with id: ' + event.referralCodeId,
    });
  }
}
