import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateUserEvent } from '../../event/create-user.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@EventsHandler(CreateUserEvent)
export class CreateUserEventHandler implements IEventHandler<CreateUserEvent> {
  constructor(@Inject('API_LOG_SERVICE') private readonly client: ClientProxy) {}
  handle(event: CreateUserEvent): void {
    this.client.emit(
      {
        cmd: 'add-log',
      },
      event,
    );
  }
}
