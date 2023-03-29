import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ShiftProfileOwnerEvent } from '../../event/shift-profile-owner.event';
import { ApiLogService } from '../../../../api-log/api-log.service';

@EventsHandler(ShiftProfileOwnerEvent)
export class ShiftProfileOwnerEventHandler implements IEventHandler<ShiftProfileOwnerEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: ShiftProfileOwnerEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      module: event.module,
      method: event.method,
      body: 'Profile with id: ' + event.id + ' have been shifted to user with id: ' + event.owner + '',
    });
  }
}
