import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddAvatarProfileCommand } from '../../command/add-avatar-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { AddAvatarProfileEvent } from '../../event/add-avatar-profile.event';
import { RemoveMediaCommand } from '../../command/remove-media.command';

@CommandHandler(AddAvatarProfileCommand)
export class AddAvatarProfileCommandHandler implements ICommandHandler<AddAvatarProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: AddAvatarProfileCommand): Promise<void> {
    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        relations: ['avatarMedia'],
        where: {
          id: command.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddAvatarProfileCommandHandler',
            localisation: 'ProfileRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Profile not found');
      });

    if (profile.avatarMedia) {
      await this.commandBus.execute(
        new RemoveMediaCommand({
          mediaId: profile.avatarMedia.id,
        }),
      );
    }

    profile.avatarMedia = command.mediaEntity;
    await this.profileRepository.save(profile).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddAvatarProfileCommandHandler',
          localisation: 'ProfileRepository.save',
          error: error,
        }),
      );
      throw new Error('Profile not saved');
    });
    await this.eventBus.publish(
      new AddAvatarProfileEvent({
        profileId: profile.id,
        mediaId: command.mediaEntity.id,
      }),
    );
  }
}
