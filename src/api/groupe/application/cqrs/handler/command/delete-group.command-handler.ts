import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteGroupCommand } from '../../command/delete-group.command';
import { Repository } from 'typeorm';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { DeleteGroupEvent } from '../../event/delete-group.event';

@CommandHandler(DeleteGroupCommand)
export class DeleteGroupCommandHandler implements ICommandHandler<DeleteGroupCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteGroupCommand): Promise<void> {
    const group = await this.groupRepository
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
            handler: 'DeleteGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });
    await this.groupRepository
      .remove(group)
      .then(() => {
        this.eventBus.publish(new DeleteGroupEvent({ groupId: command.groupId }));
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'groupRepository.delete',
            handler: 'DeleteGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });
  }
}
