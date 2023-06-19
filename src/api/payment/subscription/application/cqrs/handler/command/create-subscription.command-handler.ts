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
    const subscription = new SubscriptionEntity({
      user: command.userEntity,
      price: command.priceEntity,
      subscriptionStripeId: command.stripeSubscription.id,
      stripeLatestInvoiceId: command.latestInvoiceId,
      trialEndDate: command.stripeSubscription.trial_end
        ? new Date(command.stripeSubscription.trial_end * 1000)
        : undefined,
      trialStartDate: command.stripeSubscription.trial_start
        ? new Date(command.stripeSubscription.trial_start * 1000)
        : undefined,
      status: StatusSubscriptionEnum.ACTIVE,
      currentPeriodStart: new Date(command.stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(command.stripeSubscription.current_period_end * 1000),
    });
    const createdSubscription: SubscriptionEntity = await this.subscriptionRepository
      .save(subscription)
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateSubscriptionCommandHandler',
            error: error.message,
            localisation: 'subscription.repository.save',
          }),
        );
        throw new Error('Error while saving subscription');
      });

    this.eventBus.publish(
      new CreateSubscriptionEvent({
        subscriptionId: subscription.id,
        userId: command.userEntity.id,
      }),
    );

    return createdSubscription;
  }
}
