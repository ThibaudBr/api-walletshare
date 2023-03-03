import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ErrorCustomEvent } from './error-custom.event';
import { logger } from '../../config/winston-logger.config';

@EventsHandler(ErrorCustomEvent)
export class ErrorCustomEventHandler implements IEventHandler<ErrorCustomEvent> {
  handle(event: ErrorCustomEvent): void {
    const logger_console = new Logger(event.localisation);
    logger_console.error(event.error);

    logger.error(event);
  }
}
