import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftDeleteProfileCommand } from '../../command/soft-delete-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { SoftDeleteProfileEvent } from '../../event/soft-delete-profile.event';
import { ErrorCustomEvent } from '../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(SoftDeleteProfileCommand)
export class SoftDeleteProfileCommandHandler implements ICommandHandler<SoftDeleteProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftDeleteProfileCommand): Promise<void> {
    try {
      const profile = await this.profileRepository
        .findOneOrFail({
          where: [{ id: command.id }],
        })
        .catch(() => {
          throw new Error('Profile not found');
        });
      await this.profileRepository.softRemove(profile);
      this.eventBus.publish(
        new SoftDeleteProfileEvent({
          id: command.id,
        }),
      );
    } catch (error) {
      this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'SoftDeleteProfileCommandHandler',
          localisation: 'profile',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
