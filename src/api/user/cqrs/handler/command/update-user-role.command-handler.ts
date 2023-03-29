import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserRoleCommand } from '../../command/update-user-role.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserRoleEvent } from '../../event/update-user-role.event';
import { UserEntity } from '../../../domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';

@CommandHandler(UpdateUserRoleCommand)
export class UpdateUserRoleCommandHandler implements ICommandHandler<UpdateUserRoleCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserRoleCommand): Promise<void> {
    try {
      await this.userRepository.update(command.userId, { roles: command.roles });
      await this.eventBus.publish(new UpdateUserRoleEvent(command));
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'user', handler: 'UpdateUserRoleCommandHandler', error: error }),
      );
      throw new Error(error.message);
    }
  }
}
