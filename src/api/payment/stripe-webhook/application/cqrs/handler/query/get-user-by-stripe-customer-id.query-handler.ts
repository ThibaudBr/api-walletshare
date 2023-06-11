import {EventBus, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {ErrorCustomEvent} from '../../../../../../../util/exception/error-handler/error-custom.event';
import {Repository} from 'typeorm';
import {GetUserByStripeCustomerIdQuery} from '../../query/get-user-by-stripe-customer-id.query';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '../../../../../../user/domain/entities/user.entity';

@QueryHandler(GetUserByStripeCustomerIdQuery)
export class GetUserByStripeCustomerIdQueryHandler implements IQueryHandler<GetUserByStripeCustomerIdQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetUserByStripeCustomerIdQuery): Promise<UserEntity> {
    return await this.userRepository
      .findOneOrFail({
        where: {
          stripeCustomerId: query.stripeCustomerId,
        },
      })
      .catch(async (error: any) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'userRepository.findOne',
            handler: 'GetUserByStripeCustomerIdQueryHandler',
            error: error,
          }),
        );
        throw new Error('User not found');
      });
  }
}
