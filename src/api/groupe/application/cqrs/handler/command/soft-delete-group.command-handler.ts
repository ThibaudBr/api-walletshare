import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftDeleteGroupEvent } from '../../event/soft-delete-group.event';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SoftDeleteGroupCommand } from '../../command/soft-delete-group.command';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';

@CommandHandler(SoftDeleteGroupCommand)
export class SoftDeleteGroupCommandHandler implements ICommandHandler<SoftDeleteGroupCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftDeleteGroupCommand): Promise<void> {
    const groupToDelete = await this.groupRepository
      .findOneOrFail({
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
            handler: 'SoftDeleteGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });
    await this.groupRepository
      .softRemove(groupToDelete)
      .then(async () => {
        await this.eventBus.publish(new SoftDeleteGroupEvent({ groupId: command.groupId }));
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'groupRepository.softRemove',
            handler: 'SoftDeleteGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });
  }
}
