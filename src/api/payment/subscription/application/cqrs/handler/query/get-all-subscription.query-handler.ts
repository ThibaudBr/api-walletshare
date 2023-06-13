import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { GetAllSubscriptionQuery } from '../../query/get-all-subscription.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetAllSubscriptionQuery)
export class GetAllSubscriptionQueryHandler implements IQueryHandler<GetAllSubscriptionQuery> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetAllSubscriptionQuery): Promise<SubscriptionEntity[]> {
    const subscriptions: SubscriptionEntity[] = await this.subscriptionRepository
      .find({
        withDeleted: true,
        relations: ['price', 'price.product', 'user', 'invoices', 'referralCode'],
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetAllSubscriptionQueryHandler',
            error: error.message,
            localisation: 'subscription.repository.find',
          }),
        );
        throw new Error('Error while getting subscription');
      });
    return subscriptions;
  }
}
