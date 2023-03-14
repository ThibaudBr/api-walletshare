import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveRefreshTokenCommand } from '../../command/remove-refresh-token.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveRefreshTokenCommand)
export class RemoveRefreshTokenCommandHandler implements ICommandHandler<RemoveRefreshTokenCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {}

  async execute(command: RemoveRefreshTokenCommand): Promise<void> {
    try {
      await this.userRepository.update(command.userId, {
        currentHashedRefreshToken: undefined,
      });
    } catch (error) {
      this.eventBus.publish(new ErrorCustomEvent('user', 'RemoveRefreshTokenCommandHandler', error));
    }
  }
}
