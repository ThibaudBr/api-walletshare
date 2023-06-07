import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CancelSubscriptionCommand } from '../../command/cancel-subscription.command';
import { StatusSubscriptionEnum } from '../../../../domain/enum/status-subscription.enum';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { Repository } from 'typeorm';
import { CancelSubscriptionEvent } from '../../event/cancel-subscription.event';

@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionCommandHandler implements ICommandHandler<CancelSubscriptionCommand> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CancelSubscriptionCommand): Promise<void> {
    const subscription = await this.subscriptionRepository
      .findOneOrFail({
        where: {
          id: command.subscriptionId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CancelSubscriptionCommandHandler',
            error: error.message,
            localisation: 'subscription.find-one',
          }),
        );
        throw new Error('Subscription not found');
      });

    subscription.status = StatusSubscriptionEnum.CANCELED;
    await this.subscriptionRepository.save(subscription);

    await this.eventBus.publish(
      new CancelSubscriptionEvent({
        subscriptionId: subscription.id,
      }),
    );
  }
}
