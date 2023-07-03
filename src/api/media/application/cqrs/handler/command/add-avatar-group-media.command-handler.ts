import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddAvatarGroupMediaCommand } from '../../command/add-avatar-group-media.command';
import { InjectRepository } from '@nestjs/typeorm';
import { AddAvatarGroupMediaEvent } from '../../event/add-avatar-group-media.event';
import { GroupEntity } from '../../../../../groupe/domain/entities/group.entity';
import { Repository } from 'typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import { SoftRemoveMediaCommand } from '../../command/soft-remove-media.command';

@CommandHandler(AddAvatarGroupMediaCommand)
export class AddAvatarGroupMediaCommandHandler implements ICommandHandler<AddAvatarGroupMediaCommand> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: AddAvatarGroupMediaCommand): Promise<void> {
    const group: GroupEntity = await this.groupRepository
      .findOneOrFail({
        loadEagerRelations: false,
        relations: ['avatarMedia'],
        where: {
          id: command.groupId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'AddAvatarGroupMediaCommandHandler',
            localisation: 'groupRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('Group not found');
      });

    if (group.avatarMedia) {
      await this.commandBus.execute(
        new SoftRemoveMediaCommand({
          mediaId: group.avatarMedia.id,
        }),
      );
    }

    group.avatarMedia = command.mediaEntity;
    await this.groupRepository.save(group).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'AddAvatarGroupMediaCommandHandler',
          localisation: 'GroupRepository.save',
          error: error.message,
        }),
      );
    });
    await this.eventBus.publish(
      new AddAvatarGroupMediaEvent({
        groupId: group.id,
        mediaId: command.mediaEntity.id,
      }),
    );
  }
}
