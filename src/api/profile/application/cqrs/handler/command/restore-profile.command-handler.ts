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
    const profile = await this.profileRepository
      .findOneOrFail({
        withDeleted: true,
        where: [{ id: command.profileId }],
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            localisation: 'profileRepository.findOneOrFail',
            handler: 'RestoreProfileCommandHandler',
            error: error.message,
          }),
        );
        throw new Error('Profile not found');
      });
    if (!profile.deletedAt) throw new Error('Profile is not soft deleted');
    await this.profileRepository.restore(command.profileId).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RestoreProfileCommandHandler',
          error: error.message,
          localisation: 'profileRepository.restore',
        }),
      );
      throw new Error('Profile not restored');
    });
    await this.eventBus.publish(
      new RestoreProfileEvent({
        profileId: command.profileId,
      }),
    );
  }
}
