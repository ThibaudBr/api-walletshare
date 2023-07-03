import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreNotificationCommand } from '../../command/restore-notification.command';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { RestoreNotificationEvent } from '../../event/restore-notification.event';

@CommandHandler(RestoreNotificationCommand)
export class RestoreNotificationCommandHandler implements ICommandHandler<RestoreNotificationCommand> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreNotificationCommand): Promise<void> {
    const notification: NotificationEntity = await this.notificationRepository
      .findOneOrFail({
        where: {
          id: command.notificationId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'ResoreNotificationCommandHandler',
            localisation: 'notificationHandler',
            error: error.message,
          }),
        );
        throw new Error('Notification not found');
      });
    notification.isRead = false;
    await this.notificationRepository.save(notification);
    await this.eventBus.publish(
      new RestoreNotificationEvent({
        notificationId: notification.id,
      }),
    );
  }
}
