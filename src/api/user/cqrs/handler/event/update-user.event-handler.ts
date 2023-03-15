import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateUserEvent } from '../../event/update-user.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@EventsHandler(UpdateUserEvent)
export class UpdateUserEventHandler implements IEventHandler<UpdateUserEvent> {
  constructor(@Inject('API_LOG') private readonly client: ClientProxy) {}
  handle(event: UpdateUserEvent): void {
    this.client.emit(
      {
        cmd: 'add-log',
      },
      event,
    );
  }
}
