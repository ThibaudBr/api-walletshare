import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, SoftRemoveEvent } from 'typeorm';
import { PriceEntity } from '../../../price/domain/entities/price.entity';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';

@EventSubscriber()
export class PriceSubscriptionSubscriber implements EntitySubscriberInterface<PriceEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return PriceEntity;
  }

  async beforeRemove(event: RemoveEvent<PriceEntity>): Promise<void> {
    const removedPrice: PriceEntity | undefined = event.entity;
    const subscriptionRepository = event.manager.getRepository(SubscriptionEntity);
    const subscriptions: SubscriptionEntity[] = await subscriptionRepository.find({
      relations: ['price'],
      withDeleted: true,
      where: {
        price: {
          id: removedPrice?.id,
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

  async beforeSoftRemove(event: SoftRemoveEvent<PriceEntity>): Promise<void> {
    const softRemovedPrice: PriceEntity | undefined = event.entity;
    const subscriptionRepository = event.manager.getRepository(SubscriptionEntity);
    const subscriptions: SubscriptionEntity[] = await subscriptionRepository.find({
      relations: ['price'],
      where: {
        price: {
          id: softRemovedPrice?.id,
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
