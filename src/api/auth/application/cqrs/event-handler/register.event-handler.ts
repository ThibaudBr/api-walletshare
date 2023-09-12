import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { logger } from '../../../../../util/config/winston-logger.config';
import { RegisterEvent } from '../event/register.event';
import { ApiLogService } from '../../../../api-log/application/api-log.service';

@EventsHandler(RegisterEvent)
export class RegisterEventHandler implements IEventHandler<RegisterEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}
  async handle(event: RegisterEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: `New user with ${event.userId} have registered`,
    });
  }
}
