import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProfileCommand } from '../../command/delete-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteProfileEvent } from '../../event/delete-profile.event';
import { ProfileEntity } from '../../../domain/entities/profile.entity';
import { Repository } from 'typeorm';

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileCommandHandler implements ICommandHandler<DeleteProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    try {
      const profile = await this.profileRepository
        .findOneOrFail({
          where: [{ id: command.id }],
        })
        .catch(() => {
          throw new Error('Profile not found');
        });
      await this.profileRepository.remove(profile);
      this.eventBus.publish(
        new DeleteProfileEvent({
          deleteProfileCommand: command,
        }),
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
