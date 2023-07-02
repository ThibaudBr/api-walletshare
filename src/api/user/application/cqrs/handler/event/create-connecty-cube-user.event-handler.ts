import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateConnectyCubeUserEvent } from '../../event/create-connecty-cube-user.event';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(CreateConnectyCubeUserEvent)
export class CreateConnectyCubeUserEventHandler implements IEventHandler<CreateConnectyCubeUserEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateConnectyCubeUserEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Create ConnectyCube User with id: ' + event.userId + ' and connectyCubeId: ' + event.connectyCubeId,
    });
  }
}
