import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsUserIdOwnerOfStripeCustomerIdQuery } from '../../query/is-user-id-owner-of-stripe-customer-id.query';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';

@QueryHandler(IsUserIdOwnerOfStripeCustomerIdQuery)
export class IsUserIdOwnerOfStripeCustomerIdQueryQueryHandler
  implements IQueryHandler<IsUserIdOwnerOfStripeCustomerIdQuery>
{
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: IsUserIdOwnerOfStripeCustomerIdQuery): Promise<boolean> {
    const user: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          id: query.userId,
        },
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'payment',
            handler: 'IsUserIdOwnerOfStripCustomerIdQueryQueryHandler',
            error: error,
          }),
        );
        throw new Error('User not found');
      });

    return user.stripeCustomerId === query.stripeCustomerId;
  }
}
