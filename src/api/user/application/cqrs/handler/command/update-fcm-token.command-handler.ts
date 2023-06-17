import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateFcmTokenCommand } from '../../command/update-fcm-token.command';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(UpdateFcmTokenCommand)
export class UpdateFcmTokenCommandHandler implements ICommandHandler<UpdateFcmTokenCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateFcmTokenCommand): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository
      .findOneOrFail({
        where: { id: command.userId },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            error: error.message,
            handler: 'UpdateFcmTokenCommandHandler',
            localisation: 'userRepository.findOneOrFail',
          }),
        );
        throw new Error('User not found');
      });

    user.fcmToken = command.fcmToken;
    return await this.userRepository.save(user).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          error: error.message,
          handler: 'UpdateFcmTokenCommandHandler',
          localisation: 'userRepository.save',
        }),
      );
      throw error;
    });
  }
}
