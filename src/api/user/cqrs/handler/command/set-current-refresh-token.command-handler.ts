import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SetCurrentRefreshTokenCommand } from '../../command/set-current-refresh-token.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(SetCurrentRefreshTokenCommand)
export class SetCurrentRefreshTokenCommandHandler implements ICommandHandler<SetCurrentRefreshTokenCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private eventBus: EventBus,
  ) {}

  async execute(command: SetCurrentRefreshTokenCommand): Promise<void> {
    try {
      const currentHashedRefreshToken = await bcrypt.hash(command.refreshToken, 10);
      await this.userRepository.update(command.userId, {
        currentHashedRefreshToken,
      });
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({ localisation: 'user', handler: 'SetCurrentRefreshTokenCommandHandler', error: error }),
      );
    }
  }
}
