import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateUserEvent } from '../../event/create-user.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(CreateUserEvent)
export class CreateUserEventHandler implements IEventHandler<CreateUserEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: CreateUserEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with id: ' + event.userId + ' created with email: ' + event.createUserDto.email,
    });
  }
}
