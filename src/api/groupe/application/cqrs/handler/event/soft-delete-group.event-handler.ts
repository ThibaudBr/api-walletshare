import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftDeleteGroupEvent } from '../../event/soft-delete-group.event';
import { Repository } from 'typeorm';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorSoftDeleteRuntimeException } from '../../../../../../util/exception/runtime-exception/error-soft-delete.runtime-exception';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ApiLogService } from '../../../../../api-log/application/api-log.service';

@EventsHandler(SoftDeleteGroupEvent)
export class SoftDeleteGroupEventHandler implements IEventHandler<SoftDeleteGroupEvent> {
  constructor(private readonly apiLogService: ApiLogService) {}

  async handle(event: SoftDeleteGroupEvent): Promise<void> {
    await this.apiLogService.createLogForMethode({
      method: event.method,
      module: event.module,
      body: 'Group with id ' + event.groupId + ' has been soft deleted',
    });
  }
}
