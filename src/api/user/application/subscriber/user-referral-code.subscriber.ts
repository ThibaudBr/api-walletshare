import { EntitySubscriberInterface, EventSubscriber, RemoveEvent, Repository, SoftRemoveEvent } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { ReferralCodeEntity } from '../../domain/entities/referral-code.entity';

@EventSubscriber()
export class UserReferralCodeSubscriber implements EntitySubscriberInterface<UserEntity> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  listenTo() {
    return UserEntity;
  }

  async beforeSoftRemove(event: SoftRemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser: UserEntity | undefined = event.entity;
    const referralCodeRepository: Repository<ReferralCodeEntity> = event.manager.getRepository(ReferralCodeEntity);
    const referralCodes: ReferralCodeEntity[] = await referralCodeRepository.find({
      relations: ['owner'],
      where: {
        owner: {
          id: softRemovedUser?.id,
        },
      },
    });
    if (referralCodes.length == 0) return;
    await referralCodeRepository.softRemove(referralCodes)
      .catch(error => {
        console.log(error);
      });
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    const softRemovedUser: UserEntity | undefined = event.entity;
    const referralCodeRepository: Repository<ReferralCodeEntity> = event.manager.getRepository(ReferralCodeEntity);
    const referralCodes: ReferralCodeEntity[] = await referralCodeRepository.find({
      relations: ['owner'],
      withDeleted: true,
      where: {
        owner: {
          id: softRemovedUser?.id,
        },
      },
    });

    if (referralCodes.length == 0) return;
    await referralCodeRepository.remove(referralCodes)
      .catch(error => {
        console.log(error);
      });
  }
}
