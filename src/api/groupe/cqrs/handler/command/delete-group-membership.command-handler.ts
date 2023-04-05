import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembershipEntity } from '../../../domain/entities/group-membership.entity';
import { Repository } from 'typeorm';
import { DeleteGroupMembershipCommand } from '../../command/delete-group-membership.command';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(DeleteGroupMembershipCommand)
export class DeleteGroupMembershipCommandHandler implements ICommandHandler<DeleteGroupMembershipCommand> {
  constructor(
    @InjectRepository(GroupMembershipEntity)
    private readonly groupMembershipRepository: Repository<GroupMembershipEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteGroupMembershipCommand): Promise<void> {
    const groupMembership = await this.groupMembershipRepository
      .findOneOrFail({
        withDeleted: true,
        where: {
          id: command.groupMembershipId,
        },
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'group',
            handler: 'DeleteGroupMembershipCommandHandler',
            error: error.message,
          }),
        );
        throw error;
      });

    await this.groupMembershipRepository.delete(groupMembership.id).catch(error => {
      this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'group',
          handler: 'DeleteGroupMembershipCommandHandler',
          error: error.message,
        }),
      );
      throw error;
    });
  }
}
