import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreUserCommand } from '../../command/restore-user.command';
import { RestoreUserEvent } from '../../event/restore-user.event';
import { UserEntity } from '../../../domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(RestoreUserCommand)
export class RestoreUserCommandHandler implements ICommandHandler<RestoreUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    public eventBus: EventBus,
  ) {}

  async execute(command: RestoreUserCommand): Promise<void> {
    try {
      if (!command.userId) throw new Error('User id is required');
      if ((await this.userRepository.find({ where: { id: command.userId } })).length === 0)
        throw new Error('User not found');
      await this.userRepository.restore(command.userId);
      this.eventBus.publish(new RestoreUserEvent(command.userId));
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'user', handler: 'RestoreUserCommandHandler', error }),
      );
      throw error;
    }
  }
}
