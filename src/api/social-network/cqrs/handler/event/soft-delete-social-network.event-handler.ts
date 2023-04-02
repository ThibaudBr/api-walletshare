import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../api-log/api-log.service';
import { SoftDeleteSocialNetworkEvent } from '../../event/soft-delete-social-network.event';

@EventsHandler(SoftDeleteSocialNetworkEvent)
export class SoftDeleteSocialNetworkEventHandler implements IEventHandler<SoftDeleteSocialNetworkEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftDeleteSocialNetworkEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'SocialNetwork with id: ' + event.id + ' have been soft deleted',
    });
  }
}
