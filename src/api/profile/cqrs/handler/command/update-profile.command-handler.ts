import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileEvent } from '../../event/update-profile.event';
import { UpdateProfileCommand } from '../../command/update-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    try {
      const profile = await this.profileRepository
        .findOneOrFail({
          where: [{ id: command.id }],
        })
        .catch(() => {
          throw new Error('Profile not found');
        });

      await this.profileRepository.update(profile.id, command.updateProfileDto);
      this.eventBus.publish(
        new UpdateProfileEvent({
          updateProfileCommand: command,
        }),
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
