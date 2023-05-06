import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ShiftProfileOwnerCommand } from '../../command/shift-profile-owner.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(ShiftProfileOwnerCommand)
export class ShiftProfileOwnerCommandHandler implements ICommandHandler<ShiftProfileOwnerCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ShiftProfileOwnerCommand): Promise<void> {
    const profile = await this.profileRepository
      .findOneOrFail({
        where: [{ id: command.profileId }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'profileRepository.findOneOrFail',
            handler: 'ShiftProfileOwnerCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Profile not found');
      });
    profile.user = await this.userRepository
      .findOneOrFail({
        where: [{ id: command.userId }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'userRepository.findOneOrFail',
            handler: 'ShiftProfileOwnerCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('User not found');
      });
    await this.profileRepository.save(profile).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'ShiftProfileOwnerCommandHandler',
          error: error.message,
          localisation: 'profileRepository.save',
        }),
      );
      throw new Error('Profile not saved');
    });
  }
}
