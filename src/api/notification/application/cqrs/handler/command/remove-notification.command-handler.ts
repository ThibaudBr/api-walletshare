import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveNotificationCommand } from '../../command/remove-notification.command';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { RemoveNotificationEvent } from '../../event/remove-notification.event';

@CommandHandler(RemoveNotificationCommand)
export class RemoveNotificationCommandHandler implements ICommandHandler<RemoveNotificationCommand> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveNotificationCommand): Promise<void> {
    const notification: NotificationEntity = await this.notificationRepository
      .findOneOrFail({
        where: {
          id: command.notificationId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveNotificationCommandHandler',
            localisation: 'notificationHandler',
            error: error.message,
          }),
        );
        throw new Error('Notification not found');
      });
    await this.notificationRepository.remove(notification);
    await this.eventBus.publish(
      new RemoveNotificationEvent({
        notificationId: notification.id,
      }),
    );
  }
}
