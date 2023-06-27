import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { UserEntity } from '../../../../user/domain/entities/user.entity';

@EventSubscriber()
export class UserSubscriptionSubscriber implements EntitySubscriberInterface<UserEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return UserEntity;
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    const removedUser: UserEntity | undefined = event.entity;
    const subscriptionRepository = event.manager.getRepository(SubscriptionEntity);
    const subscriptions: SubscriptionEntity[] = await subscriptionRepository.find({
      relations: ['user'],
      withDeleted: true,
      where: {
        user: {
          id: removedUser?.id,
        },
      },
    });
    if (subscriptions.length == 0) return;
    for (const subscription of subscriptions) {
      await subscriptionRepository.remove(subscription).catch(error => {
        console.log(error);
      });
    }
  }

  async beforeSoftRemove(event: SoftRemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser: UserEntity | undefined = event.entity;
    const subscriptionRepository = event.manager.getRepository(SubscriptionEntity);
    const subscriptions: SubscriptionEntity[] = await subscriptionRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: softRemovedUser?.id,
        },
      },
    });
    if (subscriptions.length == 0) return;
    for (const subscription of subscriptions) {
      await subscriptionRepository.softRemove(subscription).catch(error => {
        console.log(error);
      });
    }
  }
}
