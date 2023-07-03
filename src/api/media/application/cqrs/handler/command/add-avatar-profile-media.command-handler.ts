import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddAvatarProfileMediaCommand } from '../../command/add-avatar-profile-media.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { AddAvatarProfileMediaEvent } from '../../event/add-avatar-profile-media.event';
import { SoftRemoveMediaCommand } from '../../command/soft-remove-media.command';

@CommandHandler(AddAvatarProfileMediaCommand)
export class AddAvatarProfileMediaCommandHandler implements ICommandHandler<AddAvatarProfileMediaCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: AddAvatarProfileMediaCommand): Promise<void> {
    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        loadEagerRelations: false,
        relations: ['avatarMedia'],
        where: {
          id: command.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddAvatarProfileMediaCommandHandler',
            localisation: 'ProfileRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('Profile not found');
      });

    if (profile.avatarMedia) {
      await this.commandBus.execute(
        new SoftRemoveMediaCommand({
          mediaId: profile.avatarMedia.id,
        }),
      );
    }

    profile.avatarMedia = command.mediaEntity;
    await this.profileRepository.save(profile).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddAvatarProfileMediaCommandHandler',
          localisation: 'ProfileRepository.save',
          error: error.message,
        }),
      );
      throw new Error('Profile not saved');
    });
    await this.eventBus.publish(
      new AddAvatarProfileMediaEvent({
        profileId: profile.id,
        mediaId: command.mediaEntity.id,
      }),
    );
  }
}
