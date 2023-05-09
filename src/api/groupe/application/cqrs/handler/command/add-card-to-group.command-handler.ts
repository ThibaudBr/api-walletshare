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
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

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
    const cardToAdd = await this.cardRepository
      .findOneOrFail({
        where: {
          id: command.cardId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddCardToGroupCommandHandler',
            localisation: 'cardRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw error;
      });

    const group = await this.groupRepository
      .findOneOrFail({
        relations: ['members', 'members.card'],
        where: {
          id: command.groupId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddCardToGroupCommandHandler',
            localisation: 'groupRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw error;
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

    await this.groupRepository.save(group).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddCardToGroupCommandHandler',
          localisation: 'groupRepository.save',
          error: error.message,
        }),
      );
    });
    await this.eventBus.publish(
      new AddCardToGroupEvent({
        cardId: command.cardId,
        groupId: command.groupId,
      }),
    );
  }
}
