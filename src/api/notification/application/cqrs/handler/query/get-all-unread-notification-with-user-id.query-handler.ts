import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { GetAllUnreadNotificationWithUserIdQuery } from '../../query/get-all-unread-notification-with-user-id.query';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllUnreadNotificationWithUserIdQuery)
export class GetAllUnreadNotificationWithUserIdQueryHandler
  implements IQueryHandler<GetAllUnreadNotificationWithUserIdQuery>
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllUnreadNotificationWithUserIdQuery): Promise<NotificationEntity[]> {
    const user: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          id: query.userId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllUnreadNotificationWithUserIdQueryHandler',
            localisation: 'notificationHandler',
            error: error.message,
          }),
        );
        throw new Error('User not found');
      });
    return await this.notificationRepository
      .find({
        where: {
          user: {
            id: user.id,
          },
          isRead: false,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllUnreadNotificationWithUserIdQueryHandler',
            localisation: 'notificationHandler',
            error: error.message,
          }),
        );
        throw new Error('Error while getting all notifications');
      });
  }
}
