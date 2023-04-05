import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { DeleteUserCommand } from '../../command/delete-user.command';
import { DeleteUserEvent } from '../../event/delete-user.event';
import { InvalidIdHttpException } from '../../../../../util/exception/custom-http-exception/invalid-id.http-exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    public eventBus: EventBus,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    try {
      await this.userRepository.delete(command.userId);
      this.eventBus.publish(new DeleteUserEvent(command.userId));
    } catch (error) {
      this.eventBus.publish(new ErrorCustomEvent({ localisation: 'user', handler: 'DeleteUserCommandHandler', error }));
      throw new InvalidIdHttpException();
    }
  }
}
