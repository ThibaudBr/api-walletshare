import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftDeleteUserCommand } from '../../command/soft-delete-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { SoftDeleteUserEvent } from '../../event/soft-delete-user.event';

@CommandHandler(SoftDeleteUserCommand)
export class SoftDeleteUserCommandHandler implements ICommandHandler<SoftDeleteUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    public eventBus: EventBus,
  ) {}

  async execute(command: SoftDeleteUserCommand): Promise<void> {
    try {
      const userToSoftRemove = await this.userRepository
        .findOneOrFail({
          relations: ['profiles', 'profiles.personalCards', 'profiles.savedCard'],
          where: { id: command.userId },
        })
        .catch(() => {
          throw new Error('User not found');
        });

      await this.userRepository.softRemove(userToSoftRemove);
      await this.eventBus.publish(new SoftDeleteUserEvent(command.userId));
    } catch (error) {
      await this.eventBus.publish(new ErrorCustomEvent({ localisation: 'user', handler: 'DeleteUserCommandHandler', error }));
      throw error;
    }
  }
}
