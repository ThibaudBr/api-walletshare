import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateGroupCommand } from '../../command/create-group.command';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembershipEntity } from '../../../../domain/entities/group-membership.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { RoleGroupMembershipEnum } from '../../../../domain/enum/role-group-membership.enum';
import { CardEntity } from '../../../../../card/domain/entities/card.entity';
import { ErrorInvalidGroupNameRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-group-name.runtime-exception';
import { ErrorInvalidIdRuntimeException } from '../../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorSaveRuntimeException } from '../../../../../../util/exception/runtime-exception/error-save.runtime-exception';
import { CreateGroupEvent } from '../../event/create-group.event';

@CommandHandler(CreateGroupCommand)
export class CreateGroupCommandHandler implements ICommandHandler<CreateGroupCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateGroupCommand): Promise<void> {
    if (command.name === undefined || command.name === null) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'group',
          handler: 'CreateGroupCommandHandler',
          error: 'Name is undefined or null',
        }),
      );
      throw new ErrorInvalidGroupNameRuntimeException('Invalid group name');
    }
    if (command.name.length < 3 || command.name.length > 20) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'group',
          handler: 'CreateGroupCommandHandler',
          error: 'Name length is not between 3 and 20',
        }),
      );
      throw new ErrorInvalidGroupNameRuntimeException('Invalid group name');
    }

    const card = await this.cardRepository
      .findOneOrFail({
        relations: ['groupMemberships'],
        where: [
          {
            id: command.cardId,
          },
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'cardRepository.findOneOrFail',
            handler: 'CreateGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Invalid id for card');
      });

    const newGroup = await this.groupRepository
      .save({
        name: command.name,
        members: [
          new GroupMembershipEntity({
            role: RoleGroupMembershipEnum.OWNER,
            card: card,
          }),
        ],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'groupRepository.save',
            handler: 'CreateGroupCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorSaveRuntimeException('Error while saving group');
      });

    await this.eventBus.publish(new CreateGroupEvent({ cardId: command.cardId, groupId: newGroup.id }));
  }
}
