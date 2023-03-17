import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteUserEvent } from '../../event/delete-user.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiLogService } from "../../../../api-log/api-log.service";

@EventsHandler(DeleteUserEvent)
export class DeleteUserEventHandler implements IEventHandler<DeleteUserEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}
  async handle(event: DeleteUserEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'User with id: ' + event.userId + ' deleted',
    });
  }
}
