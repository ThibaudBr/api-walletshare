import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SetReferralCodeCommand } from '../../command/set-referral-code.command';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { ReferralCodeEntity } from '../../../../domain/entities/referral-code.entity';
import { SetReferralCodeEvent } from '../../event/set-referral-code.event';
import { Repository } from 'typeorm';

@CommandHandler(SetReferralCodeCommand)
export class SetReferralCodeCommandHandler implements ICommandHandler<SetReferralCodeCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReferralCodeEntity)
    private readonly referralCodeRepository: Repository<ReferralCodeEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SetReferralCodeCommand): Promise<ReferralCodeEntity> {
    const userEntity: UserEntity = await this.userRepository
      .findOneOrFail({
        where: {
          id: command.userId,
        },
      })
      .catch(async (error: Error) => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'userRepository..findOneOrFail',
            handler: 'SetReferralCodeCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('User not found');
      });

    const newReferralCodeEntity: ReferralCodeEntity = new ReferralCodeEntity({
      referralCodeString: command.referralCode.code,
      stripeId: command.referralCode.id,
    });

    userEntity.referralCode = newReferralCodeEntity;

    await this.userRepository.save(userEntity).catch(async (error: Error) => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          localisation: 'userRepository..save',
          handler: 'SetReferralCodeCommandHandler',
          error: error.message,
        }),
      );
      throw new Error('Referral code not set');
    });

    await this.eventBus.publish(
      new SetReferralCodeEvent({
        userId: userEntity.id,
        referralCodeId: newReferralCodeEntity.id,
      }),
    );

    return userEntity.referralCode;
  }
}
