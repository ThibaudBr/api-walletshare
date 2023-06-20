import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreGroupCommand } from '../../command/restore-group.command';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ErrorRestoreRuntimeException } from '../../../../../../util/exception/runtime-exception/error-restore.runtime-exception';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import {RestoreGroupEvent} from "../../event/restore-group.event";

@CommandHandler(RestoreGroupCommand)
export class RestoreGroupCommandHandler implements ICommandHandler<RestoreGroupCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreGroupCommand): Promise<void> {
    await this.groupRepository
      .findOneOrFail({
        withDeleted: true,
        where: [
          {
            id: command.groupId,
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'groupRepository.findOneOrFail',
            handler: 'RestoreGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Invalid group id');
      });
    await this.groupRepository
      .restore(command.groupId)
      .then(async () => {
        await this.eventBus.publish(new RestoreGroupEvent({ groupId: command.groupId }));
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'groupRepository.restore',
            handler: 'RestoreGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorRestoreRuntimeException('Error while restoring group');
      });
  }
}
