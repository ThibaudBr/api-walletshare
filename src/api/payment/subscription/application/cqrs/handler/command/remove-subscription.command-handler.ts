import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveSubscriptionCommand } from '../../command/remove-subscription.command';
import { RemoveSubscriptionEvent } from '../../event/remove-subscription.event';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RemoveSubscriptionCommand)
export class RemoveSubscriptionCommandHandler implements ICommandHandler<RemoveSubscriptionCommand> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveSubscriptionCommand): Promise<void> {
    const subscription = await this.subscriptionRepository
      .findOneOrFail({
        where: {
          id: command.subscriptionId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveSubscriptionCommand',
            error: error.message,
            localisation: 'subscriptionRepository.findOneOrFail',
          }),
        );
        throw new Error('Subscription not found');
      });

    await this.subscriptionRepository.remove(subscription).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RemoveSubscriptionCommand',
          error: error.message,
          localisation: 'subscriptionRepository.remove',
        }),
      );
      throw new Error('Subscription not removed');
    });

    await this.eventBus.publish(
      new RemoveSubscriptionEvent({
        subscriptionId: command.subscriptionId,
      }),
    );
  }
}
