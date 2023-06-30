import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { GetSubscriptionByStripeSubscriptionIdQuery } from '../../query/get-subscription-by-stripe-subscription-id.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@QueryHandler(GetSubscriptionByStripeSubscriptionIdQuery)
export class GetSubscriptionByStripeSubscriptionIdQueryHandler
  implements IQueryHandler<GetSubscriptionByStripeSubscriptionIdQuery>
{
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetSubscriptionByStripeSubscriptionIdQuery): Promise<SubscriptionEntity> {
    return await this.subscriptionRepository
      .findOneOrFail({
        relations: ['price', 'price.product', 'invoices', 'user'],
        where: { subscriptionStripeId: query.stripeSubscriptionId },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'GetSubscriptionByStripeSubscriptionIdQueryHandler',
            localisation: 'subscriptionRepository.findOne',
            error: error.message,
          }),
        );
        throw new Error('Subscription not found');
      });
  }
}
