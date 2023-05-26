import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftRemoveNotificationCommand } from '../../command/soft-remove-notification.command';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(SoftRemoveNotificationCommand)
export class SoftRemoveNotificationCommandHandler implements ICommandHandler<SoftRemoveNotificationCommand> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftRemoveNotificationCommand): Promise<void> {
    const notification: NotificationEntity = await this.notificationRepository
      .findOneOrFail({
        where: {
          id: command.notificationId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'SoftRemoveNotificationCommandHandler',
            localisation: 'notificationHandler',
            error: error,
          }),
        );
        throw new Error('Notification not found');
      });
    await this.notificationRepository.softRemove(notification);
    await this.eventBus.publish(
      new SoftRemoveNotificationCommand({
        notificationId: notification.id,
      }),
    );
  }
}
