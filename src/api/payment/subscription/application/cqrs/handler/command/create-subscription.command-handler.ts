import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateSubscriptionCommand } from '../../command/create-subscription.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { PriceEntity } from '../../../../../price/domain/entities/price.entity';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { StatusSubscriptionEnum } from '../../../../domain/enum/status-subscription.enum';
import { CreateSubscriptionEvent } from '../../event/create-subscription.event';

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionCommandHandler implements ICommandHandler<CreateSubscriptionCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateSubscriptionCommand): Promise<SubscriptionEntity> {
    const user = await this.userRepository
      .findOneOrFail({
        where: {
          id: command.userId,
        },
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateSubscriptionEventHandler',
            error: error.message,
            localisation: 'user.find-one',
          }),
        );
        throw new Error('User not found');
      });

    const price = await this.priceRepository
      .findOneOrFail({
        where: {
          id: command.priceId,
        },
      })
      .catch(error => {
        this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateSubscriptionEventHandler',
            error: error.message,
            localisation: 'price.find-one',
          }),
        );
        throw new Error('Price not found');
      });

    const subscription = new SubscriptionEntity({
      user: user,
      price: price,
      subscriptionStripeId: command.subscriptionStripeId,
      status: StatusSubscriptionEnum.PENDING,
    });

    const createdSubscription: SubscriptionEntity = await this.subscriptionRepository.save(subscription);

    this.eventBus.publish(
      new CreateSubscriptionEvent({
        subscriptionId: subscription.id,
        userId: user.id,
      }),
    );

    return createdSubscription;
  }
}
