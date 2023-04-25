import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';
import { DeleteSocialNetworkEvent } from '../../event/delete-social-network.event';

@EventsHandler(DeleteSocialNetworkEvent)
export class DeleteSocialNetworkEventHandler implements IEventHandler<DeleteSocialNetworkEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: DeleteSocialNetworkEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'SocialNetwork with id: ' + event.id + ' have been deleted',
    });
  }
}
