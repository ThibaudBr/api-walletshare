import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { MarkNotificationAsReadCommand } from '../../command/mark-notification-as-read.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { MarkNotificationAsReadEvent } from '../../event/mark-notification-as-read.event';

@CommandHandler(MarkNotificationAsReadCommand)
export class MarkNotificationAsReadCommandHandler implements ICommandHandler<MarkNotificationAsReadCommand> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: MarkNotificationAsReadCommand): Promise<void> {
    const notification: NotificationEntity = await this.notificationRepository
      .findOneOrFail({
        where: {
          id: command.notificationId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'MarkNotificationAsReadCommandHandler',
            localisation: 'notificationHandler',
            error: error,
          }),
        );
        throw new Error('Notification not found');
      });
    notification.isRead = true;
    await this.notificationRepository.save(notification);
    await this.eventBus.publish(
      new MarkNotificationAsReadEvent({
        notificationId: notification.id,
      }),
    );
  }
}
