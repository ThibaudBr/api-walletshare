import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCredentialCommand } from '../../command/update-user-credential.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';
import { Repository } from 'typeorm';
import { UpdateUserCredentialEvent } from '../../event/update-user-credential.event';

@CommandHandler(UpdateUserCredentialCommand)
export class UpdateUserCredentialCommandHandler implements ICommandHandler<UpdateUserCredentialCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCredentialCommand): Promise<void> {
    try {
      await this.userRepository.update(command.updateUserCredentialDto.userId, command.updateUserCredentialDto);
      await this.eventBus.publish(new UpdateUserCredentialEvent(command.updateUserCredentialDto.userId));
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'user', handler: 'UpdateUserCredentialCommandHandler', error: error }),
      );
    }
  }
}
