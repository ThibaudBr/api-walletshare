import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUsedReferralCodeCommand } from '../../command/create-used-referral-code.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../../user/domain/entities/user.entity';
import { Repository } from 'typeorm';
import { SubscriptionEntity } from '../../../../domain/entities/subscription.entity';
import { ErrorCustomEvent } from '../../../../../../../util/exception/error-handler/error-custom.event';
import { ReferralCodeEntity } from '../../../../domain/entities/referal-code.entity';
import { CreateUsedReferralCodeEvent } from '../../event/create-used-referral-code.event';

@CommandHandler(CreateUsedReferralCodeCommand)
export class CreateUsedReferralCodeCommandHandler implements ICommandHandler<CreateUsedReferralCodeCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectRepository(ReferralCodeEntity)
    private readonly referralCodeRepository: Repository<ReferralCodeEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUsedReferralCodeCommand): Promise<ReferralCodeEntity> {
    const user = await this.userRepository
      .findOneOrFail({
        where: {
          id: command.userId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateUsedReferralCodeEventHandler',
            error: error.message,
            localisation: 'user.find-one',
          }),
        );
        throw new Error('User not found');
      });

    const ownerOfReferralCode = await this.userRepository
      .findOneOrFail({
        where: {
          referralCode: command.referralCode,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateUsedReferralCodeEventHandler',
            error: error.message,
            localisation: 'user.find-one',
          }),
        );
        throw new Error('Referral code not found');
      });

    const subscription = await this.subscriptionRepository
      .findOneOrFail({
        where: {
          id: command.subscriptionId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'CreateUsedReferralCodeEventHandler',
            error: error.message,
            localisation: 'subscription.find-one',
          }),
        );
        throw new Error('Subscription not found');
      });

    const newUsedReferralCode = new ReferralCodeEntity({
      usedBy: user,
      code: command.referralCode,
      owner: ownerOfReferralCode,
      subscription: subscription,
    });

    const referralCode: ReferralCodeEntity = await this.referralCodeRepository.save(newUsedReferralCode);

    await this.eventBus.publish(
      new CreateUsedReferralCodeEvent({
        referralCodeId: referralCode.id,
        userId: user.id,
      }),
    );

    return referralCode;
  }
}
