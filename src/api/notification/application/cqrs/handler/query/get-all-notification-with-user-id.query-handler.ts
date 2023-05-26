import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllNotificationWithUserIdQuery } from '../../query/get-all-notification-with-user-id.query';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../../../../domain/entities/notification.entity';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllNotificationWithUserIdQuery)
export class GetAllNotificationWithUserIdQueryHandler implements IQueryHandler<GetAllNotificationWithUserIdQuery> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllNotificationWithUserIdQuery): Promise<NotificationEntity[]> {
    const user: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          id: query.userId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllNotificationWithUserIdQueryHandler',
            localisation: 'notificationHandler',
            error: error,
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
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllNotificationWithUserIdQueryHandler',
            localisation: 'notificationHandler',
            error: error,
          }),
        );
        throw new Error('Error while getting all notifications');
      });
  }
}
