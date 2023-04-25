import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ShiftProfileOwnerCommand } from '../../command/shift-profile-owner.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { UserEntity } from '../../../../../user/domain/entities/user.entity';

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
    try {
      const profile = await this.profileRepository
        .findOneOrFail({
          where: [{ id: command.profileId }],
        })
        .catch(() => {
          throw new Error('Profile not found');
        });
      profile.user = await this.userRepository
        .findOneOrFail({
          where: [{ id: command.userId }],
        })
        .catch(() => {
          throw new Error('User not found');
        });
      await this.profileRepository.save(profile);
    } catch (error) {
      throw error;
    }
  }
}
