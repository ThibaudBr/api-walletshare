import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeleteUserEvent } from '../../event/delete-user.event';
import { Logger } from '@nestjs/common';
import { logger } from '../../../../../util/config/winston-logger.config';

@EventsHandler(DeleteUserEvent)
export class DeleteUserEventHandler implements IEventHandler<DeleteUserEvent> {
  logger_console = new Logger('DeleteUser');

  handle(event: DeleteUserEvent): void {
    logger.info('User with id : ' + event.userId + ' have been delete');

    this.logger_console.log(
      'User with id : ' + event.userId + ' have been delete',
    );
  }
}
