import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../command/create-notification.command';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { CreateNotificationEvent } from '../../event/create-notification.event';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationCommandHandler implements ICommandHandler<CreateNotificationCommand> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateNotificationCommand): Promise<void> {
    const user = await this.userRepository
      .findOneOrFail({
        where: {
          id: command.userId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateNotificationCommand',
            error: error.message,
            localisation: 'userRepository.findOneOrFail',
          }),
        );
        throw new Error('User not found');
      });

    const notification = new NotificationEntity({
      ...command,
      title: command.notificationTitle,
      description: command.notificationMessage,
      user: user,
    });

    await this.notificationRepository.save(notification).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'CreateNotificationCommand',
          error: error.message,
          localisation: 'notificationRepository.save',
        }),
      );
      throw new Error('Notification not created');
    });

    await this.eventBus.publish(
      new CreateNotificationEvent({
        userId: command.userId,
        notificationType: command.notificationType,
      }),
    );
  }
}
