import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SoftRemoveMediaCommand } from '../../command/soft-remove-media.command';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { Repository } from 'typeorm';
import { SoftRemoveMediaEvent } from '../../event/soft-remove-media.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(SoftRemoveMediaCommand)
export class SoftRemoveMediaCommandHandler implements ICommandHandler<SoftRemoveMediaCommand> {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SoftRemoveMediaCommand): Promise<void> {
    const media: MediaEntity = await this.mediaRepository
      .findOneOrFail({
        where: {
          id: command.mediaId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'SoftRemoveMediaCommandHandler',
            localisation: 'MediaRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('Media not found');
      });

    await this.mediaRepository.softRemove(media).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'SoftRemoveMediaCommandHandler',
          localisation: 'MediaRepository.softRemove',
          error: error.message,
        }),
      );
      throw new Error('Media not soft removed');
    });
    await this.eventBus.publish(
      new SoftRemoveMediaEvent({
        mediaId: media.id,
      }),
    );
  }
}
