import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMonthlySubscriptionStatusCommand } from '../../command/update-monthly-subscription-status.command';
import { UserEntity } from '../../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { UpdateMonthlySubscriptionStatusEvent } from '../../event/update-monthly-subscription-status.event';

@CommandHandler(UpdateMonthlySubscriptionStatusCommand)
export class UpdateMonthlySubscriptionStatusCommandHandler
  implements ICommandHandler<UpdateMonthlySubscriptionStatusCommand>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateMonthlySubscriptionStatusCommand): Promise<void> {
    const user: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          stripeCustomerId: command.stripCustomerId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'UpdateMonthlySubscriptionStatusCommandHandler',
            localisation: 'userRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('User not found');
      });

    user.monthlySubscriptionStatus = command.subscriptionStatus;
    await this.userRepository.save(user).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'UpdateMonthlySubscriptionStatusCommandHandler',
          localisation: 'userRepository.save',
          error: error.message,
        }),
      );
      throw new Error('User while saving user');
    });

    await this.eventBus.publish(
      new UpdateMonthlySubscriptionStatusEvent({
        subscriptionStatus: command.subscriptionStatus,
        stripCustomerId: command.stripCustomerId,
      }),
    );
  }
}
