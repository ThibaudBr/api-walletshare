import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreProfileEvent } from '../../event/restore-profile.event';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../../../domain/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RestoreProfileCommand } from '../../command/restore-profile.command';

@CommandHandler(RestoreProfileCommand)
export class RestoreProfileCommandHandler implements ICommandHandler<RestoreProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreProfileCommand): Promise<void> {
    try {
      await this.profileRepository
        .findOneOrFail({
          where: [{ id: command.profileId }],
        })
        .catch(() => {
          throw new Error('Profile not found');
        });
      await this.profileRepository.restore(command.profileId);
      this.eventBus.publish(
        new RestoreProfileEvent({
          profileId: command.profileId,
        }),
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
