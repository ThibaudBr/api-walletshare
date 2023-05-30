import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllNotificationQuery } from '../../query/get-all-notification.query';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllNotificationQuery)
export class GetAllNotificationQueryHandler implements IQueryHandler<GetAllNotificationQuery> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find().catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'GetAllNotificationQueryHandler',
          localisation: 'notificationHandler',
          error: error,
        }),
      );
      throw new Error('Error while getting all notifications');
    });
  }
}
