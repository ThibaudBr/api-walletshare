import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {CreateStripeCustomerEvent} from "../../event/create-stripe-customer.event";
import {ApiLogService} from "../../../../../api-log/application/api-log.service";

@EventsHandler(CreateStripeCustomerEvent)
export class CreateStripeCustomerEventHandler implements IEventHandler<CreateStripeCustomerEvent> {
  constructor(private readonly apiLogService: ApiLogService) {
  }

  async handle(event: CreateStripeCustomerEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.handler,
      module: event.module,
      body: ' Create Strip Customer with id : ' + event.userId + ' email: ' + event.email + ' and name: ' + event.username + ' and stripeCustomerId: ' + event.stripeCustomerId,
    })
  }
}
