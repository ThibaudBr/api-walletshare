import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { GetListMySubscriptionQuery } from '../../query/get-list-my-subscription.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetListMySubscriptionQuery)
export class GetListMySubscriptionQueryHandler implements IQueryHandler<GetListMySubscriptionQuery> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetListMySubscriptionQuery): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository
      .find({
        relations: ['price', 'price.product', 'invoice', 'user'],
        where: {
          user: {
            id: query.userId,
          },
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetListMySubscriptionQueryHandler',
            error: error.message,
            localisation: 'subscription.repository.find',
          }),
        );
        throw new Error('Error while getting list of subscription');
      });
  }
}
