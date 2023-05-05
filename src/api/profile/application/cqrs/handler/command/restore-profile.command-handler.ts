import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreProfileEvent } from '../../event/restore-profile.event';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../../../domain/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RestoreProfileCommand } from '../../command/restore-profile.command';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RestoreProfileCommand)
export class RestoreProfileCommandHandler implements ICommandHandler<RestoreProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreProfileCommand): Promise<void> {
    try {
      const profile = await this.profileRepository
        .findOneOrFail({
          withDeleted: true,
          where: [{ id: command.profileId }],
        })
        .catch(() => {
          throw new Error('Profile not found');
        });
      if (!profile.deletedAt) throw new Error('Profile is not soft deleted');
      await this.profileRepository.restore(command.profileId);
      await this.eventBus.publish(
        new RestoreProfileEvent({
          profileId: command.profileId,
        }),
      );
    } catch (error) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RestoreProfileCommandHandler',
          localisation: 'profile',
          error: error.message,
        }),
      );
      throw error;
    }
  }
}
