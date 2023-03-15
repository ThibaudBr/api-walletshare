import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveRefreshTokenEvent } from '../../event/remove-refresh-token.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@EventsHandler(RemoveRefreshTokenEvent)
export class RemoveRefreshTokenEventHandler implements IEventHandler<RemoveRefreshTokenEvent> {
  constructor(@Inject('API_LOG') private readonly client: ClientProxy) {}
  handle(event: RemoveRefreshTokenEvent): void {
    this.client.emit(
      {
        cmd: 'add-log',
      },
      event,
    );
  }
}
