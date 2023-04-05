import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AcceptGroupRequestCommand } from '../../command/accept-group-request.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRequestEntity } from '../../../domain/entities/group-request.entity';
import { GroupMembershipEntity } from '../../../domain/entities/group-membership.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { RoleGroupMembershipEnum } from '../../../domain/enum/role-group-membership.enum';
import { AcceptGroupRequestEvent } from '../../event/accept-group-request.event';
import { GroupRequestStatusEnum } from '../../../domain/enum/group-request-status.enum';
import { ErrorInvalidIdRuntimeException } from '../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorCardAlreadyInGroupRuntimeException } from '../../../../../util/exception/runtime-exception/error-card-already-in-group.runtime-exception';
import { ErrorUpdateRuntimeException } from '../../../../../util/exception/runtime-exception/error-group-request.runtime-exception';
import { ErrorSoftDeleteRuntimeException } from '../../../../../util/exception/runtime-exception/error-soft-delete.runtime-exception';

@CommandHandler(AcceptGroupRequestCommand)
export class AcceptGroupRequestCommandHandler implements ICommandHandler<AcceptGroupRequestCommand> {
  constructor(
    @InjectRepository(GroupRequestEntity)
    private readonly groupRequestRepository: Repository<GroupRequestEntity>,
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AcceptGroupRequestCommand): Promise<void> {
    const groupRequest = await this.groupRequestRepository
      .findOneOrFail({
        relations: ['group', 'card'],
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
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'AcceptGroupRequestCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Invalid id for group request');
      });
    await this.groupMembershipRepository
      .find({
        relations: ['group', 'card'],
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
      .then(groupMembershipList => {
        if (groupMembershipList.length > 0)
          throw new ErrorCardAlreadyInGroupRuntimeException(command.groupId, command.cardId);
      });

    await this.groupMembershipRepository.save(
      new GroupMembershipEntity({
        group: groupRequest.group,
        card: groupRequest.card,
        role: RoleGroupMembershipEnum.MEMBER,
      }),
    );
    await this.groupRequestRepository.update(groupRequest.id, { status: GroupRequestStatusEnum.JOINED }).catch(() => {
      this.eventBus.publish(
        new AcceptGroupRequestEvent({
          cardId: command.cardId,
          groupId: command.groupId,
        }),
      );
      throw new ErrorUpdateRuntimeException('Error while updating group request');
    });
    await this.groupRequestRepository.softDelete(groupRequest.id).catch(() => {
      this.eventBus.publish(
        new AcceptGroupRequestEvent({
          cardId: command.cardId,
          groupId: command.groupId,
        }),
      );
      throw new ErrorSoftDeleteRuntimeException('Error while soft deleting group request');
    });
    await this.eventBus.publish(
      new AcceptGroupRequestEvent({
        cardId: command.cardId,
        groupId: command.groupId,
      }),
    );
  }
}
