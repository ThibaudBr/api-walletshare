import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CreateCardEvent } from "../../event/create-card.event";
import { ApiLogService } from "../../../../api-log/api-log.service";

@EventsHandler(CreateCardEvent)
export class CreateCardEventHandler implements IEventHandler<CreateCardEvent> {
  constructor(
    private readonly apiLogService: ApiLogService,
  ) {
  }

  async handle(event: CreateCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' created for profile: ' + event.profileId,
    });
  }
}
