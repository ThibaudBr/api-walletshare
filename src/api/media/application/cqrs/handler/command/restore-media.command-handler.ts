import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RestoreMediaCommand } from '../../command/restore-media.command';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { Repository } from 'typeorm';
import { RestoreMediaEvent } from '../../event/restore-media.event';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';

@CommandHandler(RestoreMediaCommand)
export class RestoreMediaCommandHandler implements ICommandHandler<RestoreMediaCommand> {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RestoreMediaCommand): Promise<void> {
    const media: MediaEntity = await this.mediaRepository
      .findOneOrFail({
        where: {
          id: command.mediaId,
        },
        withDeleted: true,
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RestoreMediaCommandHandler',
            localisation: 'MediaRepository.findOneOrFail',
            error: error.message,
          }),
        );
        throw new Error('Media not found');
      });

    await this.mediaRepository.restore(media.id).catch(async error => {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RestoreMediaCommandHandler',
          localisation: 'MediaRepository.restore',
          error: error.message,
        }),
      );
      throw new Error('Media not restored');
    });
    await this.eventBus.publish(
      new RestoreMediaEvent({
        mediaId: media.id,
      }),
    );
  }
}
