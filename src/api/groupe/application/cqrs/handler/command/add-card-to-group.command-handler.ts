import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddCardToGroupCommand } from '../../command/add-card-to-group.command';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../../../card/domain/entities/card.entity';
import { GroupMembershipEntity } from '../../../../domain/entities/group-membership.entity';
import { ErrorCardAlreadyInGroupRuntimeException } from '../../../../../../util/exception/runtime-exception/error-card-already-in-group.runtime-exception';
import { RoleGroupMembershipEnum } from '../../../../domain/enum/role-group-membership.enum';
import { AddCardToGroupEvent } from '../../event/add-card-to-group.event';

@CommandHandler(AddCardToGroupCommand)
export class AddCardToGroupCommandHandler implements ICommandHandler<AddCardToGroupCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddCardToGroupCommand): Promise<void> {
    const cardToAdd = await this.cardRepository.findOneOrFail({
      where: {
        id: command.cardId,
      },
    });

    const group = await this.groupRepository.findOneOrFail({
      relations: ['members', 'members.card'],
      where: {
        id: command.groupId,
      },
    });

    group.members.forEach((groupMembership: GroupMembershipEntity) => {
      if (groupMembership.card.id == command.cardId) {
        throw new ErrorCardAlreadyInGroupRuntimeException(command.groupId, command.cardId);
      }
    });

    group.members.push(
      new GroupMembershipEntity({
        group: group,
        card: cardToAdd,
        role: RoleGroupMembershipEnum.MEMBER,
      }),
    );

    await this.groupRepository.save(group);
    await this.eventBus.publish(
      new AddCardToGroupEvent({
        cardId: command.cardId,
        groupId: command.groupId,
      }),
    );
  }
}
