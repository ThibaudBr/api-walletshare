import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CancelGroupRequestCommand } from '../../command/cancel-group-request.command';
import { Repository } from 'typeorm';
import { GroupRequestEntity } from '../../../domain/entities/group-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { GroupRequestStatusEnum } from '../../../domain/enum/group-request-status.enum';
import { ErrorInvalidIdRuntimeException } from '../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';
import { ErrorUpdateRuntimeException } from '../../../../../util/exception/runtime-exception/error-group-request.runtime-exception';
import { ErrorDeleteRuntimeException } from '../../../../../util/exception/runtime-exception/error-delete.runtime-exception';

@CommandHandler(CancelGroupRequestCommand)
export class CancelGroupRequestCommandHandler implements ICommandHandler<CancelGroupRequestCommand> {
  constructor(
    @InjectRepository(GroupRequestEntity)
    private readonly groupRequestRepository: Repository<GroupRequestEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CancelGroupRequestCommand): Promise<void> {
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
            handler: 'CancelGroupRequestCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorInvalidIdRuntimeException('Invalid id for group or user');
      });

    await this.groupRequestRepository
      .update(groupRequest.id, { status: GroupRequestStatusEnum.CANCELED })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'CancelGroupRequestCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorUpdateRuntimeException('Error while updating group request');
      });
    await this.groupRequestRepository
      .softDelete(groupRequest.id)
      .then(() => {
        this.eventBus.publish(new CancelGroupRequestCommand({ groupId: command.groupId, cardId: command.cardId }));
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'CancelGroupRequestCommandHandler',
            error: error.message,
          }),
        );
        throw new ErrorDeleteRuntimeException('Error while deleting group request');
      });
  }
}
