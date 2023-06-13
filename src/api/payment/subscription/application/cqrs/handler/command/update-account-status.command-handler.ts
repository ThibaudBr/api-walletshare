import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAccountStatusCommand } from '../../command/update-account-status.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { UpdateAccountStatusEvent } from '../../event/update-account-status.event';

@CommandHandler(UpdateAccountStatusCommand)
export class UpdateAccountStatusCommandHandler implements ICommandHandler<UpdateAccountStatusCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateAccountStatusCommand): Promise<void> {
    const userEntity: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          id: command.userId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'UpdateAccountStatusCommandHandler',
            error: error.message,
            localisation: 'user.find-one',
          }),
        );
        throw new Error('User not found');
      });

    userEntity.accountStatus = command.status;
    await this.userRepository.save(userEntity).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'UpdateAccountStatusCommandHandler',
          error: error.message,
          localisation: 'user.update',
        }),
      );
      throw new Error('User not updated');
    });

    await this.eventBus.publish(
      new UpdateAccountStatusEvent({
        status: command.status,
        userId: command.userId,
      }),
    );
  }
}
