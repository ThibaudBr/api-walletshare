import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ApiLogService } from "src/api/api-log/api-log.service";
import { UpdateCardEvent } from "../../event/update-card.event";

@EventsHandler(UpdateCardEvent)
export class UpdateCardEventHandler implements IEventHandler<UpdateCardEvent> {
  constructor(
    private readonly apiLogService: ApiLogService,
  ) {
  }

  async handle(event: UpdateCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' updated',
    });
  }
}
