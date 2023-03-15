import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SetCurrentRefreshTokenEvent } from '../../event/set-current-refresh-token.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@EventsHandler(SetCurrentRefreshTokenEvent)
export class SetCurrentRefreshTokenEventHandler implements IEventHandler<SetCurrentRefreshTokenEvent> {
  constructor(@Inject('API_LOG') private readonly client: ClientProxy) {}
  handle(event: SetCurrentRefreshTokenEvent): void {
    this.client.emit(
      {
        cmd: 'add-log',
      },
      event,
    );
  }
}
