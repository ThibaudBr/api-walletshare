import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SoftDeleteGroupEvent } from '../../event/soft-delete-group.event';
import { Repository } from 'typeorm';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorSoftDeleteRuntimeException } from '../../../../../../util/exception/runtime-exception/error-soft-delete.runtime-exception';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';

@EventsHandler(SoftDeleteGroupEvent)
export class SoftDeleteGroupEventHandler implements IEventHandler<SoftDeleteGroupEvent> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: SoftDeleteGroupEvent): Promise<void> {
    this.groupRepository
      .findOneOrFail({
        where: {
          id: event.groupId,
        },
      })
      .then(async group => {
        await this.groupRepository
          .softRemove(group)
          .then(() => {
            this.eventBus.publish(
              new SoftDeleteGroupEvent({
                groupId: group.id,
              }),
            );
          })
          .catch(() => {
            throw new ErrorSoftDeleteRuntimeException('Error while soft deleting group');
          });
      })
      .catch(() => {
        throw new ErrorInvalidIdRuntimeException('Invalid group id');
      });
  }
}
