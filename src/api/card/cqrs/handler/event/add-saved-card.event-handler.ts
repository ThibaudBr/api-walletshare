import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AddSavedCardEvent } from "../../event/add-saved-card.event";
import { ApiLogService } from "../../../../api-log/api-log.service";

@EventsHandler(AddSavedCardEvent)
export class AddSavedCardEventHandler implements IEventHandler<AddSavedCardEvent> {
  constructor(
    private readonly apiLogService: ApiLogService,
  ) {
  }

  async handle(event: AddSavedCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' saved for profile: ' + event.profileId,
    });
  }
}
