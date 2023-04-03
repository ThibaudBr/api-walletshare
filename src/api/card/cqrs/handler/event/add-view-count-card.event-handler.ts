import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ApiLogService } from "src/api/api-log/api-log.service";
import { AddViewCountCardEvent } from "../../event/add-view-count-card.event";

@EventsHandler(AddViewCountCardEvent)
export class AddViewCountCardEventHandler implements IEventHandler<AddViewCountCardEvent> {
  constructor(
    private readonly apiLogService: ApiLogService,
  ) {
  }
  async handle(event: AddViewCountCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' has been viewed',
    });
  }
}
