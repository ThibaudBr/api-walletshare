import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileEvent } from '../../event/update-profile.event';
import { UpdateProfileCommand } from '../../command/update-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { validate } from 'class-validator';

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
      const updateProfile = new ProfileEntity({
        ...profile,
        ...command.updateProfileDto,
      });

      const err = await validate(updateProfile);
      if (err.length > 0) {
        throw err;
      }

      await this.profileRepository.save(updateProfile);
      this.eventBus.publish(
        new UpdateProfileEvent({
          updateProfileCommand: command,
        }),
      );
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'UpdateProfileCommandHandler',
          error: error.message,
          localisation: 'profile',
        }),
      );
      throw error;
    }
  }
}
