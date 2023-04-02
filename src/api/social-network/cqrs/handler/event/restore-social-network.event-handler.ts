import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RestoreSocialNetworkEvent } from '../../event/restore-social-network.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(RestoreSocialNetworkEvent)
export class RestoreSocialNetworkEventHandler implements IEventHandler<RestoreSocialNetworkEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: RestoreSocialNetworkEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'SocialNetwork with id: ' + event.id + ' have been restored',
    });
  }
}
