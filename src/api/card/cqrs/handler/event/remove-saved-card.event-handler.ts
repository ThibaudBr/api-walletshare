import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RemoveSavedCardEvent } from "../../event/remove-saved-card.event";
import { ApiLogService } from "../../../../api-log/api-log.service";

@EventsHandler(RemoveSavedCardEvent)
export class RemoveSavedCardEventHandler implements IEventHandler<RemoveSavedCardEvent> {

  constructor(
    private readonly apiLogService: ApiLogService
  ) {
  }

  async handle(event: RemoveSavedCardEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Card with id: ' + event.cardId + ' have been removed from saved card of profile with id: ' + event.profileId,
    });
  }}
