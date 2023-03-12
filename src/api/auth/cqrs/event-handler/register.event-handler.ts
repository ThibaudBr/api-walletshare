import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { logger } from '../../../../util/config/winston-logger.config';
import { RegisterEvent } from '../event/register.event';

@EventsHandler(RegisterEvent)
export class RegisterEventHandler implements IEventHandler<RegisterEvent> {
  logger_console = new Logger('RegisterEventHandler');

  handle(event: RegisterEvent): any {
    logger.info('New user have registered  with id ' + event.userId);

    this.logger_console.log('New user have registered with id ' + event.userId);
  }
}
