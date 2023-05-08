import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddBannerGroupMediaCommand } from '../../command/add-banner-group-media.command';
import { AddBannerGroupMediaEvent } from '../../event/add-banner-group-media.event';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../../../../../groupe/domain/entities/group.entity';
import { Repository } from 'typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { SoftRemoveMediaCommand } from '../../command/soft-remove-media.command';

@CommandHandler(AddBannerGroupMediaCommand)
export class AddBannerGroupMediaCommandHandler implements ICommandHandler<AddBannerGroupMediaCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: AddBannerGroupMediaCommand): Promise<void> {
    const group: GroupEntity = await this.groupRepository
      .findOneOrFail({
        loadEagerRelations: false,
        relations: ['bannerMedia'],
        where: {
          id: command.groupId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddBannerGroupMediaCommandHandler',
            localisation: 'groupRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Group not found');
      });

    if (group.bannerMedia) {
      await this.commandBus.execute(
        new SoftRemoveMediaCommand({
          mediaId: group.bannerMedia.id,
        }),
      );
    }

    group.bannerMedia = command.mediaEntity;
    await this.groupRepository.save(group).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddBannerGroupMediaCommandHandler',
          localisation: 'GroupRepository.save',
          error: error,
        }),
      );
    });

    await this.eventBus.publish(
      new AddBannerGroupMediaEvent({
        groupId: group.id,
        mediaId: command.mediaEntity.id,
      }),
    );
  }
}
