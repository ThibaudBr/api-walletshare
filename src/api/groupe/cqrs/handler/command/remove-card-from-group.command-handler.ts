import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCardFromGroupCommand } from '../../command/remove-card-from-group.command';
import { Repository } from 'typeorm';
import { GroupMembershipEntity } from '../../../domain/entities/group-membership.entity';
import { GroupEntity } from '../../../domain/entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoveCardFromGroupEvent } from '../../event/remove-card-from-group.event';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { ErrorInvalidIdRuntimeException } from '../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorCardNotInGroupRuntimeException } from '../../../../../util/exception/runtime-exception/error-card-not-in-group.runtime-exception';
import { ErrorSoftDeleteRuntimeException } from '../../../../../util/exception/runtime-exception/error-soft-delete.runtime-exception';

@CommandHandler(RemoveCardFromGroupCommand)
export class RemoveCardFromGroupCommandHandler implements ICommandHandler<RemoveCardFromGroupCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveCardFromGroupCommand): Promise<void> {
    const group: GroupEntity = await this.groupRepository
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
            localisation: 'group',
            handler: 'RemoveCardFromGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Invalid group id');
      });

    if (group.members.filter(member => member.id === command.cardId).length === 0) {
      throw new ErrorCardNotInGroupRuntimeException('Card is not in group');
    }

    const groupMembership: GroupMembershipEntity = await this.groupMembershipRepository
      .findOneOrFail({
        relations: ['card', 'group'],
        where: [
          {
            card: {
              id: command.cardId,
            },
            group: {
              id: command.groupId,
            },
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'RemoveCardFromGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Invalid groupId or cardId to get groupMembership');
      });

    await this.groupMembershipRepository
      .softRemove(groupMembership)
      .then(async () => {
        await this.eventBus.publish(new RemoveCardFromGroupEvent({ groupId: command.groupId, cardId: command.cardId }));
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'RemoveCardFromGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorSoftDeleteRuntimeException('Error while soft deleting card from group');
      });
  }
}
