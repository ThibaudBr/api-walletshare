import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddBannerProfileMediaCommand } from '../../command/add-banner-profile-media.command';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../../../../profile/domain/entities/profile.entity';
import { Repository } from 'typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { AddBannerProfileMediaEvent } from '../../event/add-banner-profile-media.event';
import { SoftRemoveMediaCommand } from '../../command/soft-remove-media.command';

@CommandHandler(AddBannerProfileMediaCommand)
export class AddBannerProfileMediaCommandHandler implements ICommandHandler<AddBannerProfileMediaCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
  ) {}

  async execute(command: AddBannerProfileMediaCommand): Promise<void> {
    const profile: ProfileEntity = await this.profileRepository
      .findOneOrFail({
        loadEagerRelations: false,
        relations: ['bannerMedia'],
        where: {
          id: command.profileId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddBannerProfileMediaCommandHandler',
            localisation: 'ProfileRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('Profile not found');
      });

    if (profile.bannerMedia) {
      await this.commandBus.execute(
        new SoftRemoveMediaCommand({
          mediaId: profile.bannerMedia.id,
        }),
      );
    }

    profile.bannerMedia = command.mediaEntity;
    await this.profileRepository.save(profile).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddBannerProfileMediaCommandHandler',
          localisation: 'ProfileRepository.save',
          error: error.message,
        }),
      );
      throw new Error('Profile not saved');
    });
    await this.eventBus.publish(
      new AddBannerProfileMediaEvent({
        profileId: profile.id,
        mediaId: command.mediaEntity.id,
      }),
    );
  }
}
