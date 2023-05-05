import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateSocialNetworkEvent } from '../../event/update-social-network.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(UpdateSocialNetworkEvent)
export class UpdateSocialNetworkEventHandler implements IEventHandler<UpdateSocialNetworkEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: UpdateSocialNetworkEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'SocialNetwork with id: ' + event.id + ' have been updated',
    });
  }
}
