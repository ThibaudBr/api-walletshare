import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {ApiLogService} from "../../../../../api-log/application/api-log.service";
import {DeleteAllJoinedConversationEvent} from "../../event/delete-all-joined-conversation.event";

@EventsHandler(DeleteAllJoinedConversationEvent)
export class DeleteAllJoinedConversationEventHandler implements IEventHandler<DeleteAllJoinedConversationEvent> {
  constructor(private readonly apiLogService: ApiLogService) {
  }

  async handle(event: DeleteAllJoinedConversationEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'All joined conversation have been deleted',
    });
  }
}
