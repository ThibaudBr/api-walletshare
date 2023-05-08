import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {AddAvatarProfileCommand} from "../../command/add-avatar-profile.command";
import {AddAvatarProfileEvent} from "../../event/add-avatar-profile.event";
import {ApiLogService} from "../../../../../api-log/application/api-log.service";

@EventsHandler(AddAvatarProfileEvent)
export class AddAvatarProfileEventHandler implements IEventHandler<AddAvatarProfileEvent> {
  constructor(
    private readonly apiLogService: ApiLogService,
  ) {
  }

  async handle(event: AddAvatarProfileEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Add avatar profile with profile id: ( ' + event.profileId + ' ) and media id: ' + event.mediaId,
    })
  }
}
