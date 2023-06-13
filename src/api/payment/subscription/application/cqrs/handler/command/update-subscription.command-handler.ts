import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSubscriptionCommand } from '../../command/update-subscription.command';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { StatusSubscriptionEnum } from '../../../../domain/enum/status-subscription.enum';
import { UpdateSubscriptionEvent } from '../../event/update-subscription.event';

@CommandHandler(UpdateSubscriptionCommand)
export class UpdateSubscriptionCommandHandler implements ICommandHandler<UpdateSubscriptionCommand> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateSubscriptionCommand): Promise<SubscriptionEntity> {
    const subscriptionEntity: SubscriptionEntity = await this.subscriptionRepository
      .findOneOrFail({
        relations: ['price', 'invoices'],
        where: {
          subscriptionStripeId: command.stripeSubscription.id,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'UpdateSubscriptionCommandHandler',
            error: error.message,
            localisation: 'subscription.find-one',
          }),
        );
        throw new Error('Subscription not found');
      });

    if (subscriptionEntity.price.id !== command.priceEntity.id) {
      subscriptionEntity.price = command.priceEntity;
      await this.subscriptionRepository.save(subscriptionEntity).catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'UpdateSubscriptionCommandHandler',
            error: error.message,
            localisation: 'subscription.update',
          }),
        );
        throw new Error('Subscription not updated');
      });
    }
    const updateSubscription: SubscriptionEntity = new SubscriptionEntity({
      ...subscriptionEntity,
      currentPeriodStart: command.stripeSubscription.current_period_start
        ? new Date(command.stripeSubscription.current_period_start * 1000)
        : undefined,
      currentPeriodEnd: command.stripeSubscription.current_period_end
        ? new Date(command.stripeSubscription.current_period_end * 1000)
        : undefined,
      trialEndDate: command.stripeSubscription.trial_end
        ? new Date(command.stripeSubscription.trial_end * 1000)
        : undefined,
      status: command.stripeSubscription.status as StatusSubscriptionEnum,
      cancelAtPeriodEnd: command.stripeSubscription.cancel_at_period_end ?? false,
      canceledAt: command.stripeSubscription.canceled_at
        ? new Date(command.stripeSubscription.canceled_at * 1000)
        : undefined,
    });
    const updatedSubscription: SubscriptionEntity = await this.subscriptionRepository
      .save(updateSubscription)
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'UpdateSubscriptionCommandHandler',
            error: error.message,
            localisation: 'subscription.update',
          }),
        );
        throw new Error('Subscription not updated');
      });

    await this.eventBus.publish(
      new UpdateSubscriptionEvent({
        subscriptionId: updatedSubscription.id,
      }),
    );

    return updatedSubscription;
  }
}
