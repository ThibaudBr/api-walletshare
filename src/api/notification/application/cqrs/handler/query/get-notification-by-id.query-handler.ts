import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNotificationByIdQuery } from '../../query/get-notification-by-id.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetNotificationByIdQuery)
export class GetNotificationByIdQueryHandler implements IQueryHandler<GetNotificationByIdQuery> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetNotificationByIdQuery): Promise<NotificationEntity> {
    return await this.notificationRepository
      .findOneOrFail({
        where: {
          id: query.notificationId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetNotificationByIdQueryHandler',
            localisation: 'notificationHandler',
            error: error.message,
          }),
        );
        throw new Error('Notification not found');
      });
  }
}
