import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMediaCommand } from '../../command/remove-media.command';
import { S3 } from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from '../../../../domain/entities/media.entity';
import { Repository } from 'typeorm';
import { ErrorCustomEvent } from '../../../../../../util/exception/error-handler/error-custom.event';
import * as process from 'process';
import { RemoveMediaEvent } from '../../event/remove-media.event';

@CommandHandler(RemoveMediaCommand)
export class RemoveMediaCommandHandler implements ICommandHandler<RemoveMediaCommand> {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveMediaCommand): Promise<void> {
    const mediaToDelete: MediaEntity = await this.mediaRepository
      .findOneOrFail({
        withDeleted: true,
        where: {
          id: command.mediaId,
        },
      })
      .catch(async error => {
        await this.eventBus.publish(
          new ErrorCustomEvent({
            handler: 'RemoveMediaCommandHandler',
            localisation: 'MediaRepository.findOneOrFail',
            error: error,
          }),
        );
        throw new Error('Media not found');
      });

    const s3: S3 = new S3();
    if (!process.env.AWS_PRIVATE_BUCKET_NAME) {
      await this.eventBus.publish(
        new ErrorCustomEvent({
          handler: 'RemoveMediaCommandHandler',
          localisation: 'Process.env.AWS_PRIVATE_BUCKET_NAME',
          error: 'Process.env.AWS_PRIVATE_BUCKET_NAME is not defined',
        }),
      );
      throw new Error('AWS_PRIVATE_BUCKET_NAME not found');
    }

    await s3
      .deleteObject({
        Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
        Key: mediaToDelete.key,
      })
      .promise();
    await this.mediaRepository.softRemove(mediaToDelete);
    await this.eventBus.publish(
      new RemoveMediaEvent({
        mediaId: mediaToDelete.id,
      }),
    );
  }
}
