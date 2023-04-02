import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiLogService } from '../../../../api-log/api-log.service';
import { CreateSocialNetworkEvent } from '../../event/create-social-network.event';

@EventsHandler(CreateSocialNetworkEvent)
export class CreateSocialNetworkEventHandler implements IEventHandler<CreateSocialNetworkEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateSocialNetworkEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'SocialNetwork with id: ' + event.id + ' have been created',
    });
  }
}
