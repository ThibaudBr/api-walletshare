import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProfileToSubscriptionCommand } from '../../command/remove-profile-to-subscription.command';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { ProfileEntity } from '../../../../../../profile/domain/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { Repository } from 'typeorm';

@CommandHandler(RemoveProfileToSubscriptionCommand)
export class RemoveProfileToSubscriptionCommandHandler implements ICommandHandler<RemoveProfileToSubscriptionCommand> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveProfileToSubscriptionCommand): Promise<void> {
    const subscription: SubscriptionEntity = await this.subscriptionRepository
      .findOneOrFail({
        where: {
          id: command.subscriptionId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveProfileToSubscriptionCommandHandler',
            error: error.message,
            localisation: 'subscription.repository.findOneOrFail',
          }),
        );
        throw new Error('Subscription not found');
      });

    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        where: {
          id: command.profileId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveProfileToSubscriptionCommandHandler',
            error: error.message,
            localisation: 'profile.repository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });

    subscription.profileEmployeeId = subscription.profileEmployeeId.filter((curr: string) => curr !== profile.id);

    await this.subscriptionRepository.save(subscription).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RemoveProfileToSubscriptionCommandHandler',
          error: error.message,
          localisation: 'subscription.repository.save',
        }),
      );
      throw new Error('Subscription not saved');
    });
  }
}
