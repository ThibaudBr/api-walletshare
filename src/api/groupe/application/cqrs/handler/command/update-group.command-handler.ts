import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateGroupCommand } from '../../command/update-group.command';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { UpdateGroupEvent } from '../../event/update-group.event';

@CommandHandler(UpdateGroupCommand)
export class UpdateGroupCommandHandler implements ICommandHandler<UpdateGroupCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateGroupCommand): Promise<void> {
    if (!command.name) throw new Error('Invalid name: name is required');
    if (command.name.length < 3) throw new Error('Invalid name: name must be at least 3 characters long');
    if (command.name.length > 20) throw new Error('Invalid name: name must be at most 20 characters long');

    const group = await this.groupRepository
      .findOneOrFail({
        relations: ['groupMemberships', 'groupMemberships.card'],
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
            handler: 'UpdateGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Invalid id');
      });

    group.name = command.name;

    await this.groupRepository
      .save(group)
      .then(async () => {
        await this.eventBus.publish(
          new UpdateGroupEvent({
            groupId: command.groupId,
          }),
        );
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'groupRepository.save',
            handler: 'UpdateGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Error while updating group');
      });
  }
}
