import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { DeleteCardEvent } from "../../event/delete-card.event";
import { ApiLogService } from "../../../../api-log/api-log.service";

@EventsHandler(DeleteCardEvent)
export class DeleteCardEventHandler implements IEventHandler<DeleteCardEvent> {

  constructor(
    private readonly apiLogService: ApiLogService,) {
  }
  async handle(event: DeleteCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' deleted',
    });
  }
}
