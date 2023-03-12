import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SetCurrentRefreshTokenEvent } from '../../event/set-current-refresh-token.event';
import { Logger } from '@nestjs/common';
import { logger } from '../../../../../util/config/winston-logger.config';

@EventsHandler(SetCurrentRefreshTokenEvent)
export class SetCurrentRefreshTokenEventHandler
  implements IEventHandler<SetCurrentRefreshTokenEvent>
{
  logger_console = new Logger('SetCurrentRefreshTokenEvent');

  handle(event: SetCurrentRefreshTokenEvent): void {
    logger.info('User with id : ' + event.userId + ' set new refresh token : ');
    this.logger_console.log(
      'User with id : ' + event.userId + ' set new refresh token : ',
    );
  }
}
