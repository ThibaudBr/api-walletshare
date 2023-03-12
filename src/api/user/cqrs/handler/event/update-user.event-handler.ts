import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateUserEvent } from '../../event/update-user.event';
import { Logger } from '@nestjs/common';
import { logger } from '../../../../../util/config/winston-logger.config';

@EventsHandler(UpdateUserEvent)
export class UpdateUserEventHandler implements IEventHandler<UpdateUserEvent> {
  logger_console = new Logger('UpdateUserEvent');

  handle(event: UpdateUserEvent): void {
    logger.info('User with id: ' + event.userId + ' have been update');

    this.logger_console.log(
      'User with id: ' + event.userId + ' have been update',
    );
  }
}
