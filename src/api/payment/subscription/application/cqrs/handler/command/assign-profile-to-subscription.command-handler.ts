import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AssignProfileToSubscriptionCommand } from '../../command/assign-profile-to-subscription.command';
import { ProfileEntity } from '../../../../../../profile/domain/entities/profile.entity';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { AssignProfileToSubscriptionEvent } from '../../event/assign-profile-to-subscription.event';

@CommandHandler(AssignProfileToSubscriptionCommand)
export class AssignProfileToSubscriptionCommandHandler implements ICommandHandler<AssignProfileToSubscriptionCommand> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AssignProfileToSubscriptionCommand): Promise<void> {
    const subscription: SubscriptionEntity = await this.subscriptionRepository
      .findOneOrFail({
        where: {
          id: command.subscriptionId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AssignProfileToSubscriptionCommandHandler',
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
            handler: 'AssignProfileToSubscriptionCommandHandler',
            error: error.message,
            localisation: 'profile.repository.findOneOrFail',
          }),
        );
        throw new Error('Profile not found');
      });

    if (command.isSubscriptionOwner) {
      subscription.profileOwnerId = profile.id;
    } else {
      subscription.profileEmployeeIds.push(profile.id);
    }
    await this.subscriptionRepository.save(subscription).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AssignProfileToSubscriptionCommandHandler',
          error: error.message,
          localisation: 'subscription.repository.save',
        }),
      );
      throw new Error('Error while assigning subscription');
    });
    await this.eventBus.publish(
      new AssignProfileToSubscriptionEvent({
        subscriptionId: subscription.id,
        profileId: profile.id,
      }),
    );
  }
}
