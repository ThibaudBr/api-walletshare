import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteGroupRequestCommand } from '../../command/delete-group-request.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRequestEntity } from '../../../domain/entities/group-request.entity';
import { ErrorDeleteRuntimeException } from '../../../../../util/exception/runtime-exception/error-delete.runtime-exception';
import { ErrorInvalidIdRuntimeException } from '../../../../../util/exception/runtime-exception/error-invalid-id.runtime-exception';

@CommandHandler(DeleteGroupRequestCommand)
export class DeleteGroupRequestCommandHandler implements ICommandHandler<DeleteGroupRequestCommand> {
  constructor(
    @InjectRepository(GroupRequestEntity)
    private readonly groupRequestRepository: Repository<GroupRequestEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteGroupRequestCommand): Promise<void> {
    await this.groupRequestRepository
      .findOneOrFail({
        where: [
          {
            id: command.groupRequestId,
          },
        ],
      })
      .catch(() => {
        throw new ErrorInvalidIdRuntimeException('Invalid group request id');
      });
    await this.groupRequestRepository.delete(command.groupRequestId).catch(() => {
      throw new ErrorDeleteRuntimeException('Error while deleting group request');
    });
  }
}
