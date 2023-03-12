import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveRefreshTokenEvent } from '../../event/remove-refresh-token.event';
import { Logger } from '@nestjs/common';
import { logger } from '../../../../../util/config/winston-logger.config';

@EventsHandler(RemoveRefreshTokenEvent)
export class RemoveRefreshTokenEventHandler
  implements IEventHandler<RemoveRefreshTokenEvent>
{
  logger_console = new Logger('RemoveRefreshTokenEvent');

  handle(event: RemoveRefreshTokenEvent): void {
    logger.info('User with id : ' + event.userId + ' refresh his token');

    this.logger_console.log(
      'User with id : ' + event.userId + ' refresh his token',
    );
  }
}
