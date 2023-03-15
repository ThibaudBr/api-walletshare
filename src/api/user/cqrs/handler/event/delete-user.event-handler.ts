import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteUserEvent } from '../../event/delete-user.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@EventsHandler(DeleteUserEvent)
export class DeleteUserEventHandler implements IEventHandler<DeleteUserEvent> {
  constructor(@Inject('API_LOG') private readonly client: ClientProxy) {}
  handle(event: DeleteUserEvent): void {
    this.client.emit(
      {
        cmd: 'add-log',
      },
      event,
    );
  }
}
