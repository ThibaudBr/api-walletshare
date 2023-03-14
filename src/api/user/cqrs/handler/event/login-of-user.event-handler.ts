import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginOfUserEvent } from '../../event/login-of-user.event';

@EventsHandler(LoginOfUserEvent)
export class LoginOfUserEventHandler implements IEventHandler<LoginOfUserEvent> {
  constructor(@Inject('API_LOG') private readonly client: ClientProxy) {}
  handle(event: LoginOfUserEvent): void {
    this.client.emit(
      {
        cmd: 'add-log',
      },
      event,
    );
  }
}
